import { useState } from "react";
import { View, Text } from "@tarojs/components";
import "./index.css";
export default function Index(props) {
    const [isSelect, setSelect] = useState(false);
    const { des, selectIndex, setSelectIndex, textArr } = props;
    const select = () => {
        setSelect(pre => !pre);
    }
    const setIndex = (index) => {
        setSelectIndex(index);
        setSelect(false);
    }
    return <>
        <View className="flexCenter" style={{ fontSize: "14px" }}>
            <View style={{ width: "100rpx", height: "60rpx", position: "relative" }}>
                <View className="flexBetween" onClick={select} style={{ width: "90%", height: "50rpx", alignItems: "center" }}>
                    {/* <View>{des}: <Text style={{ color: "red" }}> * </Text></View> */}
                    <View className={isSelect ? 'triangle_1' : 'triangle_2'} style={{ alignSelf: "center" }}></View>
                    <View>{textArr[selectIndex]}</View>
                </View>
                <View className="select" style={isSelect ? { height: textArr.length * 64 + 'rpx' } : { height: "0" }}>
                    {
                        textArr.map((item, index) => {
                            return <>
                                <View className="type flexCenter" style={selectIndex == index ? { color: "rgb(254,107,54)" } : {}} onClick={() => { setIndex(index) }} key={index}>{item}</View>
                            </>
                        })
                    }
                </View>
            </View>
        </View>
    </>
}