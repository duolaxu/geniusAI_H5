import { View, Input, Image, Text, ScrollView, Textarea } from "@tarojs/components";
import { baseUrl, judgeInput, heightRpx, postApi, setStorageSync, getStorageSync, pxTorpx } from "../../static";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
export default function Index() {
    const [heightrpx, setHeightrpx] = useState(0);
    const [iptValue, setIptValue] = useState("");
    const [pxtorpx, setPxtorpx] = useState(1);
    useEffect(() => {
        heightRpx(res => {
            setHeightrpx(res);
            console.log("RESH = ", res);
        })
        pxTorpx(res => {
            console.log("PXTORPX = ", res);
            setPxtorpx(res);
        })
    }, [])

    const inputing = e => {

    }

    return <><View style={{ width: "750rpx", height: heightrpx + 'rpx', backgroundColor: "white" }}>
        <View className="flexCenter" style={{ paddingBottom: `${3 * pxtorpx}px`, paddingTop: `${3 * pxtorpx}px`, width: "500rpx", height: "auto", backgroundColor: "rgb(245,245,245)", borderRadius: "100rpx", position: "fixed", bottom: "20rpx", left: "0rpx" }}>
            <Textarea placeholder="向Genius AI提问…" maxlength={100} focus={false} cursor={0} selectionStart={-1} selectionEnd={-1} showConfirmBar={false} value={iptValue} autoHeight={true} adjustPosition={true} onInput={(e) => inputing(e)} cursorSpacing={10}
                style={{ width: "85%", border: '0px solid rgb(254,108,57)', caretColor: "yellow", }}
            />
        </View>
        {/* AHDSG */}
    </View>
    </>
}