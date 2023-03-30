import { View, Text, Textarea, Button, CoverView, CoverImage, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState, useEffect } from "react";
import { getApp } from "@tarojs/taro-h5/dist/api";
import VoiceImg from "../../static/image/voice.png";
import speakImg from "../../static/image/speak.png";
import speakActiveImg from "../../static/image/speakActive.png";
import "./index.css";
import { heightRpx } from "../../static/index";
export default function Index(props) {

    const { setIptValue } = props;

    const [recordState, setRecordState] = useState(false);
    const [content, setContent] = useState("");
    const [heightrpx, setHeightRpx] = useState(0);
    const [isActive, setActive] = useState(false);

    const app = getApp();
    const plugin = Taro.requirePlugin("WechatSI");
    //获取全局唯一的语音识别管理器recordRecoManager
    const manager = plugin.getRecordRecognitionManager();


    useEffect(() => {
        initRecord();
        heightRpx(res => {
            setHeightRpx(res);
        })
        
        // Taro.ShareAppMessageObject
        // Taro.ShareAppMessageReturn({
        //     title:'',
        //     path:'pages/roomAI/index',
        //     imageUrl:'../../static/image/ChatGPT.png'
        // })
    }, [])

    const initRecord = () => {
        // 有新的识别内容返回，则会调用此事件
        manager.onRecognize = function (res) {
            console.log(res)
        }
        // 正常开始录音识别时会调用此事件
        manager.onStart = function (res) {
            console.log("成功开始录音识别", res)
        }
        // 识别错误事件
        manager.onError = function (res) {
            console.error("error msg", res)
        }
        //识别结束事件
        manager.onStop = function (res) {
            if (res.result == '') {
                Taro.showModal({
                    title: '提示',
                    content: '听不清楚，请重新说一遍！',
                    showCancel: false,
                    success: function (res) { }
                })
                return;
            }
            var text = content + res.result;
            // setContent(text);
            setIptValue(text);
        }
    }

    const touchStart = (e) => {
        setActive(true);
        Taro.vibrateShort();
        setRecordState(true);
        // 语音开始识别
        manager.start({
            lang: 'zh_CN',// 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
        })
    }
    //语音  --松开结束
    const touchEnd = (e) => {
        setRecordState(false);
        setActive(false);
        // 语音结束识别
        manager.stop();
    }

    return <>
        <View>
            <View className="yuyinWrap">
                {/* <Textarea className='yuyinCon' placeholder='请输入内容' value={content}></Textarea> */}
                <View className=''>
                    <Image src={isActive ? speakActiveImg : speakImg} style={isActive ? { width: "85rpx", height: "85rpx" } : { width: "80rpx", height: "80rpx" }} onTouchStart={touchStart} onTouchEnd={touchEnd} />
                    {/* <Button className={`yuyinBtn ${recordState == true ? 'yuyinBtnBg' : ''}`} onTouchStart={touchStart} onTouchEnd={touchEnd}>
                        <Text>
                            {recordState == false ? '按住 说话' : '松开 结束'}
                        </Text>
                    </Button> */}
                </View>
                {/* 开始语音 弹出语音图标表示正在录音 */}
                {
                    recordState == true ? <CoverView className="startYuyinImage" style={{ top: `${heightrpx / 2}rpx` }}>
                        <CoverImage src={VoiceImg}></CoverImage>
                        <CoverView>语音识别</CoverView>
                    </CoverView> : ""
                }

            </View>
        </View>
    </>
}