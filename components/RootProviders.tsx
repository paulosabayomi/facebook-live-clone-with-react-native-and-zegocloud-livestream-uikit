import React from "react";
import { Provider } from "react-redux";
import { store } from "../shared/store";
import App from "../App";
import { NavigationContainer } from '@react-navigation/native';
// @ts-ignore
import { ContextMenuProvider } from "@brnho/react-native-context-menu"
import {
    ZegoUIKitPrebuiltLiveStreamingFloatingMinimizedView,
} from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn';
import { PaperProvider } from 'react-native-paper';

const RootProviders = React.memo((props: any) => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <PaperProvider>
                    <App />
                </PaperProvider>
                {/* <ContextMenuProvider>  */}
                {/* </ContextMenuProvider>   */}
                <ZegoUIKitPrebuiltLiveStreamingFloatingMinimizedView />
            </NavigationContainer>
        </Provider>
    )
})

export default RootProviders