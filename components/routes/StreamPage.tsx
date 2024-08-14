import React from "react";
import { Dimensions, PanResponder, Text, View, StatusBar } from "react-native";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import AddUserIcon from '../../assets/icons/user-add.svg'
import BarsIcon from '../../assets/icons/bars.svg'
import HBarsIcon from '../../assets/icons/h-bars.svg'
import CalendarIcon from '../../assets/icons/calendar-alt-svgrepo-com.svg'
import MenuIcon from '../../assets/icons/menu.svg'
import AngleRightIcon from '../../assets/icons/angle-right.svg'
import SendIcon from '../../assets/icons/send.svg'
import MicIcon from '../../assets/icons/mic.svg'
import SettingsIcon from '../../assets/icons/settings.svg'
import AngleLeftIcon from '../../assets/icons/angle-left.svg'
import { Button } from "react-native-paper";
import colors from "../../shared/colors";
import ZegoUIKitPrebuiltLiveStreaming, {ZegoMenuBarButtonName, HOST_DEFAULT_CONFIG, AUDIENCE_DEFAULT_CONFIG } from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn';
import * as ZIM from 'zego-zim-react-native';
import { APP_ID, APP_SIGN } from "../../shared/secrets";
import { useAppSelector } from "../../shared/rdx-hooks";

const CUSTOM_SHEET_DEFAULT_HEIGHT = 90
const CUSTOM_SHEET_MAX_HEIGHT = Dimensions.get('screen').height * 0.75
const MAX_DRAG = Dimensions.get('screen').height * 0.35
const WINDOW_WIDTH = Dimensions.get('screen').width
const WINDOW_HEIGHT = Dimensions.get('screen').height

const StreamPage = React.memo((props: any) => {
    const bottomSheetRef = React.useRef<BottomSheet[]>([]);
    const height = useSharedValue(CUSTOM_SHEET_DEFAULT_HEIGHT)
    const video_width = useSharedValue(WINDOW_WIDTH)
    const last_pos = React.useRef<number>(0)
    const userDetail = useAppSelector(state => state.main.userDetail);
    const liveID = props.route.params?.liveID
    const [liveStreamStarted, setLiveStreamStarted] = React.useState<boolean>(false)

    React.useEffect(() => {
        console.log("props.route", props.route);
        
    }, [])

    const panner = React.useRef(PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderStart(e, gestureState) {
            // e.preventDefault()
            console.log("here", gestureState.vy);
        },
        onPanResponderMove(e, gestureState) {
            // e.preventDefault()
            console.log("moving vy", last_pos.current, gestureState.vy);

            if (gestureState.vy <= -1) {
                height.value = withTiming(CUSTOM_SHEET_MAX_HEIGHT)  
                update_video_width(height.value)              
            }else{
                height.value = height.value < CUSTOM_SHEET_DEFAULT_HEIGHT ? CUSTOM_SHEET_DEFAULT_HEIGHT : height.value + (last_pos.current - gestureState.dy)
                update_video_width(height.value)              
            }
            
            last_pos.current = gestureState.dy
        },
        onPanResponderEnd(e, gestureState) {
            console.log("responder end", gestureState.vy, MAX_DRAG);
            const dy = gestureState.dy
            
            setTimeout(() => {
                if (dy < -MAX_DRAG) {
                    height.value = withTiming(CUSTOM_SHEET_MAX_HEIGHT)
                    update_video_width(CUSTOM_SHEET_MAX_HEIGHT)              
                }else{
                    height.value = withTiming(CUSTOM_SHEET_DEFAULT_HEIGHT)
                    update_video_width(CUSTOM_SHEET_DEFAULT_HEIGHT)              
                }
            }, 0);
            last_pos.current = 0
        },
    }))

    const update_video_width = React.useCallback((sheet_height: number) => {
        if (sheet_height == CUSTOM_SHEET_MAX_HEIGHT || sheet_height == CUSTOM_SHEET_DEFAULT_HEIGHT) {
            video_width.value = withTiming(sheet_height == CUSTOM_SHEET_MAX_HEIGHT ? WINDOW_WIDTH - ((sheet_height / WINDOW_HEIGHT) * WINDOW_WIDTH) : WINDOW_WIDTH)
            if (sheet_height > CUSTOM_SHEET_DEFAULT_HEIGHT) {
                bottomSheetRef.current[1].expand()
            }else{
                bottomSheetRef.current[0].expand()
                bottomSheetRef.current[1].close()
            }
        }else{
            video_width.value = WINDOW_WIDTH - ((sheet_height / WINDOW_HEIGHT) * WINDOW_WIDTH)
            bottomSheetRef.current[0].close()
            bottomSheetRef.current[1].close()
        }

    }, [])


    return (
        <View style={{flex: 1, backgroundColor: 'black'}}>
            <View style={{alignItems: 'center',  flex: 1, paddingTop: (StatusBar.currentHeight || 60) + 10}}>
                <Animated.View style={{width: (liveStreamStarted || liveID) ? WINDOW_WIDTH : video_width, position: 'relative', borderRadius: 12, height: '100%', backgroundColor: 'green'}}>
                    <ZegoUIKitPrebuiltLiveStreaming
                        appID={APP_ID}
                        appSign={APP_SIGN}
                        userID={userDetail.id}
                        userName={userDetail.name}
                        liveID={liveID || userDetail.liveId}
                        config={{
                            ...(liveID != undefined ? AUDIENCE_DEFAULT_CONFIG : HOST_DEFAULT_CONFIG),
                            onStartLiveButtonPressed: () => {setLiveStreamStarted(true)},
                            onLiveStreamingEnded: () => {},
                            onLeaveLiveStreaming: () => { props.navigation.navigate('Home') },
                            topMenuBarConfig: {
                                buttons: [ZegoMenuBarButtonName.leaveButton],
                                showMemberListButton: false,
                                showHostLabel: false,
                            },

                        }}
                        plugins={[ZIM]}
                        durationConfig = {{
                            isVisible: false,
                        }}

                    />
                    {/* <View style={{height: 120, width: '100%', backgroundColor: 'red', zIndex: 6, position: 'absolute', top: 0}}>
                        <View><AngleLeftIcon color={'white'} width={30} height={30} /></View>
                    </View> */}
                    {/*
                    <View style={{height: 80, width: '100%', backgroundColor: 'red', padding: 15, flexDirection: 'row', alignItems: 'center', zIndex: 6, position: 'absolute', bottom: 0}}>
                        <Button labelStyle={{color: 'white', fontSize: 18,}} style={{backgroundColor: colors.fb_logo_blue, flex: 1, borderRadius: 6}}>Go Live</Button>
                        <View style={{width: 35, height: 35, alignItems: 'center', justifyContent: 'center', marginLeft: 10, backgroundColor: 'black', borderRadius: 50}}>
                            <CalendarIcon width={15} height={15} color={'white'} />
                        </View>
                    </View> */}
                </Animated.View>
            </View>
            {
                (!liveStreamStarted && !liveID) &&
                <>
                        <Animated.View style={{
                            height,
                            width: '100%',
                        }}>
                            <View {...panner.current.panHandlers} style={{height: 20, alignItems: 'center', justifyContent: 'center', width: '100%', }}>
                                <View style={{width: 60, height: 4, borderRadius: 50, backgroundColor: 'rgb(240,240,240)'}}></View>
                            </View>
                            <View>

                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10}}>
                                    <View style={{width: 40, height: 40, alignItems: 'center', borderRadius: 50, justifyContent: 'center', backgroundColor: colors.dark_icon_hightlight_color,}}>
                                        <MenuIcon width={25} height={25} color={'white'} />
                                    </View>
                                    <View style={{flex: 1, paddingHorizontal: 12}}>
                                        <Text style={{color: 'white', fontSize: 18}}>Add to your post</Text>
                                        <Text style={{color: 'rgb(210,210,210)', fontSize: 13}}>Add a description and tags</Text>
                                    </View>
                                    <View>
                                        <AngleRightIcon width={30} height={30} color={'white'} />
                                    </View>
                                </View>

                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10}}>
                                    <View style={{width: 40, height: 40, alignItems: 'center', borderRadius: 50, justifyContent: 'center', backgroundColor: colors.dark_icon_hightlight_color,}}>
                                        <SendIcon width={25} height={25} color={'white'} />
                                    </View>
                                    <View style={{flex: 1, paddingHorizontal: 12}}>
                                        <Text style={{color: 'white', fontSize: 18}}>Check in</Text>
                                        <Text style={{color: 'rgb(210,210,210)', fontSize: 13}}>Add a location in your post</Text>
                                    </View>
                                    <View>
                                        <AngleRightIcon width={30} height={30} color={'white'} />
                                    </View>
                                </View>

                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10}}>
                                    <View style={{width: 40, height: 40, alignItems: 'center', borderRadius: 50, justifyContent: 'center', backgroundColor: colors.dark_icon_hightlight_color,}}>
                                        <AddUserIcon width={25} height={25} color={'white'} />
                                    </View>
                                    <View style={{flex: 1, paddingHorizontal: 12}}>
                                        <Text style={{color: 'white', fontSize: 18}}>Bring a friend</Text>
                                        <Text style={{color: 'rgb(210,210,210)', fontSize: 13}}>Bring a friend</Text>
                                    </View>
                                    <View>
                                        <AngleRightIcon width={30} height={30} color={'white'} />
                                    </View>
                                </View>

                                <View style={{marginVertical: 15}}>
                                    <Text style={{fontWeight: 600, color: 'white', fontSize: 18}}>Features</Text>
                                </View>

                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10}}>
                                    <View style={{width: 40, height: 40, alignItems: 'center', borderRadius: 50, justifyContent: 'center', backgroundColor: colors.dark_icon_hightlight_color,}}>
                                        <HBarsIcon width={20} height={20} color={'white'} />
                                    </View>
                                    <View style={{flex: 1, paddingHorizontal: 12}}>
                                        <Text style={{color: 'white', fontSize: 18}}>Polls</Text>
                                    </View>
                                    <View>
                                        <AngleRightIcon width={30} height={30} color={'white'} />
                                    </View>
                                </View>

                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10}}>
                                    <View style={{width: 40, height: 40, alignItems: 'center', borderRadius: 50, justifyContent: 'center', backgroundColor: colors.dark_icon_hightlight_color,}}>
                                        <MicIcon width={25} height={25} color={'white'} />
                                    </View>
                                    <View style={{flex: 1, paddingHorizontal: 12}}>
                                        <Text style={{color: 'white', fontSize: 18}}>Voice enhancements</Text>
                                    </View>
                                    <View>
                                        <AngleRightIcon width={30} height={30} color={'white'} />
                                    </View>
                                </View>

                                <View style={{marginVertical: 15}}>
                                    <Text style={{fontWeight: 600, color: 'white', fontSize: 18}}>Settings and support</Text>
                                </View>

                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10}}>
                                    <View style={{width: 40, height: 40, alignItems: 'center', borderRadius: 50, justifyContent: 'center', backgroundColor: colors.dark_icon_hightlight_color,}}>
                                        <SettingsIcon width={25} height={25} color={'white'} />
                                    </View>
                                    <View style={{flex: 1, paddingHorizontal: 12}}>
                                        <Text style={{color: 'white', fontSize: 18}}>Advanced settings</Text>
                                    </View>
                                    <View>
                                        <AngleRightIcon width={30} height={30} color={'white'} />
                                    </View>
                                </View>

                            </View>
                        </Animated.View>

                        <BottomSheet
                            ref={(e) => bottomSheetRef.current?.push(e as BottomSheet)}
                            snapPoints={[60]}
                            handleComponent={() => null}
                            backgroundStyle={{paddingBottom: 0, backgroundColor: 'black'}}
                            containerStyle={{paddingBottom: 0, marginBottom: 0}}
                            >
                            <View style={{flexDirection: 'row', paddingHorizontal: 20, marginBottom: 0, justifyContent: 'space-between'}}>
                                <AddUserIcon width={30} height={30} color={'white'} />
                                <HBarsIcon width={28} height={28} color={'white'} />
                                <BarsIcon width={30} height={30} color={'white'} />
                            </View>
                        </BottomSheet>

                    <BottomSheet
                        ref={(e) => bottomSheetRef.current?.push(e as BottomSheet)}
                        snapPoints={[90]}
                        index={-1}
                        // onChange={handleSheetChanges}
                        handleComponent={() => null}
                        backgroundStyle={{backgroundColor: colors.fb_dark_grey, borderRadius: 0,}}
                        >
                        <BottomSheetView style={{padding: 15, flexDirection: 'row', alignItems: 'center'}}>
                            <Button labelStyle={{color: 'white', fontSize: 18,}} style={{backgroundColor: colors.fb_logo_blue, flex: 1, borderRadius: 6}}>Go Live</Button>
                            <View style={{width: 35, height: 35, alignItems: 'center', justifyContent: 'center', marginLeft: 10, backgroundColor: 'black', borderRadius: 50}}>
                                <CalendarIcon width={15} height={15} color={'white'} />
                            </View>
                        </BottomSheetView>
                    </BottomSheet>
                </>
            }

        </View>
    )
})

export default StreamPage