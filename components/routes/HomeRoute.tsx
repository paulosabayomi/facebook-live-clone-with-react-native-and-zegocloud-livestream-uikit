import React from "react";
import { Text, View } from "react-native";
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../screens/HomeScreen";
import VideoScreen from "../screens/VideoScreen";
import FriendsScreen from "../screens/FriendsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MenuScreen from "../screens/MenuScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import HomeIcon from '../../assets/icons/home.svg'
import VideoIcon from '../../assets/icons/video.svg'
import FriendsIcon from '../../assets/icons/friends.svg'
import ProfileIcon from '../../assets/icons/profile.svg'
import NotificationIcon from '../../assets/icons/notification.svg'
import UserIcon from '../../assets/icons/user.svg'
import FacebookIcon from '../../assets/icons/facebook.svg'
import PlusIcon from '../../assets/icons/plus.svg'
import SearchIcon from '../../assets/icons/search.svg'
import MessengerIcon from '../../assets/icons/messenger.svg'
import PostIcon from '../../assets/icons/post.svg'
import ReelIcon from '../../assets/icons/reel.svg'
import colors from "../../shared/colors";
import ContextMenu from "react-native-context-menu-view";
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';

const Tab = createBottomTabNavigator();

const HomeRoute = React.memo((props: any) => {
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const CustomTabBar = (props: BottomTabBarProps) => {

        const icon = {
            Home: (color: string) => <HomeIcon width={25} height={25} color={color} />,
            Video: (color: string) => <VideoIcon width={25} height={25} color={color} />,
            Friends: (color: string) => <FriendsIcon width={25} height={25} color={color} />,
            Profile: (color: string) => <ProfileIcon width={25} height={25} color={color} />,
            Notifications: (color: string) => <NotificationIcon width={25} height={25} color={color} />,
            Menu: (color: string) => <UserIcon width={30} height={30} color={color} />
        }
        
        return (
          <View style={{ flexDirection: 'row', paddingHorizontal: 8, height: 80, justifyContent: 'space-between', backgroundColor: 'white' }}>
            {props.state.routes.map((route, index) => {
              const { options } = props.descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;
      
              const isFocused = props.state.index === index;
      
              const onPress = () => {
                const event = props.navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
      
                if (!isFocused && !event.defaultPrevented) {
                  props.navigation.navigate(route.name, route.params);
                }
              };
      
              const onLongPress = () => {
                props.navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };
      
              return (
                <View
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onTouchEnd={onPress}
                  key={Math.floor(Math.random() * 9999999).toString()}
                  style={{ flex: 1, justifyContent: 'center', paddingTop: 10, paddingBottom: 30, position: 'relative', alignItems: 'center' }}
                >
                    {
                        isFocused &&
                        <View style={{position: 'absolute', top: 0, height: 2, width: '100%', backgroundColor: colors.fb_logo_blue}}></View>
                    }
                    <View style={{marginBottom: 6}}>
                        {   isFocused ?
                            icon[label as keyof typeof icon](colors.fb_logo_blue):
                            icon[label as keyof typeof icon]('gray')
                        }
                    </View>
                    <Text style={{ color: isFocused ? '#673ab7' : '#222', fontSize: 11 }}>
                        {label as string}
                    </Text>
                </View>
              );
            })}
          </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <Tab.Navigator tabBar={CustomTabBar}>
                <Tab.Screen name="HomeScreen" component={HomeScreen} 
                    options={{
                        tabBarLabel: 'Home',
                        title: '',
                        headerStyle: {
                            height: 120,
                        },
                        headerShadowVisible: false,
                        headerLeft(props) {
                            return <View {...props} style={{ paddingLeft: 10}}>
                                <FacebookIcon width={110} height={110} color={colors.fb_logo_blue} />
                            </View>
                        },
                        headerRight(hprop) {
                            return <View style={{flexDirection: 'row'}}>
                            
                                <Menu
                                    visible={visible}
                                    onDismiss={closeMenu}
                                    anchorPosition="bottom"
                                    elevation={0}
                                    contentStyle={{borderRadius: 12, width: 140, elevation: 0, shadowColor: 'none', backgroundColor: colors.fb_grey_light}}
                                    anchor={<View onTouchEnd={openMenu} style={{width: 40, height: 40, marginRight: 10, backgroundColor: colors.fb_grey_light, alignItems: 'center', justifyContent: 'center', borderRadius: 50}}>
                                                <PlusIcon width={30} height={30} color={'black'} />
                                            </View>}>
                                    <Menu.Item titleStyle={{color: 'black', fontWeight: 500, fontSize: 18,}} leadingIcon={() => <PostIcon color={'black'} width={20} height={20} />} title="Post" />
                                    <Divider />
                                    <Menu.Item titleStyle={{color: 'black', fontWeight: 500, fontSize: 18,}} leadingIcon={() => <ReelIcon color={'black'} width={20} height={20} />} title="Reel" />
                                    <Divider />
                                    <Menu.Item onPress={() => props.navigation.navigate('StreamPage')} titleStyle={{color: 'black', fontWeight: 500, fontSize: 18,}} leadingIcon={() => <VideoIcon color={'black'} width={20} height={20} />} title="Live" />
                                </Menu>
                                <View style={{width: 40, height: 40, marginRight: 10, backgroundColor: colors.fb_grey_light, alignItems: 'center', justifyContent: 'center', borderRadius: 50}}><SearchIcon width={25} height={25} color={'black'} /></View>
                                <View style={{width: 40, height: 40, marginRight: 10, backgroundColor: colors.fb_grey_light, alignItems: 'center', justifyContent: 'center', borderRadius: 50}}><MessengerIcon width={25} height={25} color={'black'} /></View>
                            </View>
                        },
                    }} 
                />
                <Tab.Screen name="VideoScreen" component={VideoScreen} 
                    options={{
                        tabBarLabel: 'Video',
                        title: 'Video',
                    }} 
                />
                <Tab.Screen name="FriendsScreen" component={FriendsScreen} 
                    options={{
                        tabBarLabel: 'Friends',
                        title: 'Friends',
                    }} 
                />
                <Tab.Screen name="ProfileScreen" component={ProfileScreen} 
                    options={{
                        tabBarLabel: 'Profile',
                        title: 'Profile',
                    }} 
                />
                <Tab.Screen name="NotificationScreen" component={NotificationScreen} 
                    options={{
                        tabBarLabel: 'Notifications',
                        title: 'Notifications',
                    }} 
                />
                <Tab.Screen name="MenuScreen" component={MenuScreen} 
                    options={{
                        tabBarLabel: 'Menu',
                        title: 'Menu',
                    }} 
                />
            </Tab.Navigator>
        </View>
    )
})

export default HomeRoute