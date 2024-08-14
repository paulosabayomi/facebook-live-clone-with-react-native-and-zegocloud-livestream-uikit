import React from "react";
import { Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import UserIcon from '../../assets/icons/user.svg'
import PlusIcon from '../../assets/icons/plus.svg'
import UserFilledIcon from '../../assets/icons/user-filled.svg'
import colors from "../../shared/colors";
import data from "../../shared/data";
import { useAppDispatch, useAppSelector } from "../../shared/rdx-hooks";
import { TUserDetail } from "../../shared/types";
import { setUserDetail } from "../../shared/rdx-slice";
import { Button } from "react-native-paper";


const HomeScreen = React.memo((props: any) => {
    const userDetail = useAppSelector(state => state.main.userDetail);
    const dispatch = useAppDispatch()
    const [liveID, setLiveID] = React.useState<string>('')

    const handleSetUserDetails = React.useCallback((detail: TUserDetail) => {
        dispatch(setUserDetail(detail))
    }, [])

    const handleJoinLiveStream = React.useCallback(() => {
        props.navigation.navigate('StreamPage', {liveID: liveID})
    }, [liveID])
    
    
    return (
        <ScrollView style={{flex: 1, backgroundColor: 'white',}}>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10}}>
                <View><UserIcon color={'gray'} width={50} height={50} /></View>
                <TextInput placeholder="What's on your mind" style={{fontSize: 18, marginLeft: 10}} placeholderTextColor={'black'} />
            </View>
            <View style={{height: 10, width: '100%', backgroundColor: colors.fb_grey}}></View>
            <View style={{padding: 15}}>

                <View style={{width: 120, borderColor: colors.fb_grey, borderRadius: 10, overflow: 'hidden'}}>
                    <View style={{height: 140, position: 'relative', backgroundColor: '#999', justifyContent: 'flex-end', alignItems: 'center'}}>
                        <UserFilledIcon color={'#444'} width={150} height={150} style={{position: 'absolute', bottom: -24}} />
                    </View>
                    <View style={{height: 85, position: 'relative', backgroundColor: colors.fb_grey_light, alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{height: 40, position: 'absolute', top: -20, width: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.fb_logo_blue, borderRadius: 50, borderColor: colors.fb_grey_light, }}>
                            <PlusIcon color={'white'} width={35} height={35} />
                        </View>
                        <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold', width: '50%', textAlign: 'center'}}>Create story</Text>
                    </View>
                </View>


            </View>

            <View style={{height: 10, width: '100%', backgroundColor: colors.fb_grey}}></View>

            <View  style={{paddingHorizontal: 20, marginVertical: 12}}>
                <TextInput onChangeText={setLiveID} defaultValue={liveID} placeholder="Enter Live ID" placeholderTextColor={'gray'} style={{fontSize: 18, borderColor: 'lightgray', borderWidth: 1, padding: 10, borderRadius: 10}} />
                <Button onPress={handleJoinLiveStream} style={{backgroundColor: colors.fb_logo_blue, borderRadius: 8, marginTop: 10,}} labelStyle={{color: 'white', fontSize: 15}}>
                    Join
                </Button>
            </View>

            <View style={{height: 10, width: '100%', backgroundColor: colors.fb_grey}}></View>

            <View style={{paddingHorizontal: 20, marginTop: 12}}>
                <Text style={{fontSize: 18, marginBottom: 15}}>Click to login</Text>
                {
                    data.map(d => 
                        <TouchableOpacity onPress={() => handleSetUserDetails(d)} key={Math.floor(Math.random() * 9999999).toString()} style={{padding: 15, borderRadius: 10, marginBottom: 10, width: '50%', backgroundColor: userDetail.id == d.id ? 'lightblue' : 'rgb(230,230,230)',}}>
                            <Text style={{fontSize: 18}}>{d.name}</Text>
                            <Text style={{color: colors.fb_logo_blue, fontSize: 12}}>{d.liveId}</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        </ScrollView>
    )
})

export default HomeScreen