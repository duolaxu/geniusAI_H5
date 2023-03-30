import { View, Input, Image, Text, ScrollView, Swiper, SwiperItem } from "@tarojs/components";
import { baseUrl, heightRpx, getStorageSync, postApi } from "../../static";
import Taro, { useDidHide, useDidShow, useUnload } from "@tarojs/taro";
import { useState, useEffect } from "react";
export default function Index() {
    const [heightrpx, setHeightRpx] = useState(0);
    const [userImg_1, setUserImg_1] = useState("/customerImg/default.png");
    const [userImg_2, setUserImg_2] = useState("/icon/AI.jpg");
    const [iptValue, setIptValue] = useState("");

    const scrollStyle = {
        height: `${heightrpx}rpx`,
        width: "750rpx",
    };

    useEffect(() => {

    }, [])

    return <>
        {/* <View style={{ width: "750rpx", height: 'auto', position: "relative", zIndex: "10", backgroundColor: "rgb(248,248,248)" }}> */}
        {/* <Swiper
                autoplay={true}
                interval={2000}
                duration={500}
                indicatorColor='#999'
                indicatorActiveColor='#333'
                // vertical
                circular
                // indicatorDots
            // autoplay
            >
                <SwiperItem>这是公告栏</SwiperItem>
            </Swiper> */}
        <Swiper className='swiper-container'
            style={{
                "marginLeft": "10rpx",
                "width": "400rpx",
                "height": "400rpx",
            }}
            autoplay={true} circular={true} interval={2000}>
            {/* <block wx:for='{{msgList}}'>
        <navigator url='/pages/notice/notice?title={{item.url}}' open-type='navigate'> */}
            <SwiperItem>
                <View
                    style={{
                        'position': 'absolute',
                        'top': '50%',
                        'transform': 'translateY(-50%)',
                        'width': '100%',
                        'fontSize': '28rpx',
                        'overflow': 'hidden',
                        'textOverflow': 'ellipsis',
                        'whiteSpace': 'nowrap',
                        'letterSpacing': '2rpx',
                    }}
                    className='swiper-item'>这是公告栏</View>
            </SwiperItem>
            {/* </navigator>
    </block> */}
        </Swiper>
        {/* </View> */}
    </>
}