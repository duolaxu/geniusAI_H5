import { useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import loadingImg from "../../static/image/loading.png";
import "./index.css";
export default function Index(props) {
    const { desc } = props;
    return <>
        <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {desc}&nbsp;<Image className="img" src={loadingImg} />
        </View>
    </>
}