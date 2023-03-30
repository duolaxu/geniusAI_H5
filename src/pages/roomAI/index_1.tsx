import { View, Input, Image, Text, ScrollView, Textarea } from "@tarojs/components";
import { baseUrl, judgeInput, heightRpx } from "../../static";
import Taro, { useDidHide, useDidShow } from "@tarojs/taro";
import userImg from "../../static/image/mine.jpg";
import gptImg from "../../static/image/ChatGPT.png";
import { useState, useEffect } from "react";
export default function Index() {
    const [heightrpx, setHeightRpx] = useState(0);
    // const [userImg_1, setUserImg_1] = useState("/customerImg/default.png");
    // const [userImg_2, setUserImg_2] = useState("/icon/AI.jpg");
    const [iptValue, setIptValue] = useState("");
    const [messageList, setMessageList] = useState<any[]>([]);
    const [render, setRender] = useState(true);
    const [toView, setView] = useState("view0");
    const [qusMessage, setQusMessage] = useState("");
    const [isExist, setExist] = useState(false);
    let isResponsing = true;
    let scrollTop = 0;
    const Threshold = 100;
    const scrollStyle = {
        height: `${heightrpx}rpx`,
        width: "750rpx",
    };

    let SocketTask;

    const connectSocket = (data) => {
        Taro.connectSocket({
            url: "wss://duolabest.com/djWss",
            header: {
                'content-type': 'application/json',
            },
            protocols: ['protocol1'],
            success: res => {
                console.log("connectSocket");
            }
        }).then(task => {
            task.onOpen(function () {
                console.log('onOpen')
                task.send({ data: 'xxx' })
            })
            task.onMessage(function (msg) {
                console.log('onMessage: ', msg)
                //   task.close()
                // task.close();
            })
            task.onError(function () {
                console.log('onError')
            })
            task.onClose(function (e) {
                console.log('onClose: ', e)
            })
        })
    };

    // Taro.onAppHide(res => {
    //     console.log("RES = ", res);
    //     // Taro.offAppShow(res => {
    //     //     console.log(res);
    //     // });
    //     // sendData("小程序退出")
    //     closeSocket("logOut");
    // })

    useDidHide(() => {
        closeSocket("logOut");
    })

    useDidShow(() => {


        Taro.showShareMenu({
            withShareTicket: true,
        })

        Taro.setNavigationBarTitle({ title: 'chaGPT' });
        connectSocket("logIn");
        heightRpx(res => {
            setHeightRpx(res);
        })


        // Taro.onSocketOpen(res => {
        //     console.log("连接建立 = ", res);
        //     Taro.showToast({
        //         title: '成功',
        //         icon: 'success',
        //         duration: 2000
        //     })
        // });

        // Taro.onSocketMessage(res => {
        //     let data = JSON.parse(res.data).message.replace(/^data: /, "");
        //     let lent = messageList.length - 1;
        //     if (data == '[DONE]' || data == 'DONE_OVER') {

        //     } else {
        //         let msgArr = messageList;
        //         let str = "";
        //         try {
        //             str = JSON.parse(data)?.choices[0]?.delta?.content;
        //         } catch (e) {
        //             console.log(e);
        //         }
        //         msgArr[lent].content = msgArr[lent].content + (str != undefined ? str : '');
        //         setMessageList(msgArr);
        //         setView(`view${msgArr.length - 1}`);
        //         setRender(pre => !pre);
        //     }
        // });

        // Taro.onSocketClose(res => {
        //     console.log("连接关闭 = ", res);
        //     if (res.reason != 'logOut') {
        //         connectSocket('logIn');
        //     }
        //     // setSocket(false);
        // });

        // Taro.onSocketError(res => {
        //     console.log("连接出错 = ", res);
        // });
    })

    const sendData = data => {
        Taro.sendSocketMessage({
            data: data,
            success: res => {
                console.log("sendSocketMessage");
            }
        });
    }

    const closeSocket = (data) => {
        Taro.closeSocket({
            reason: data,
            success: res => {
                console.log("closeSocket");
            }
        });

    }

    useEffect(() => {

    }, [])

    const dynamicTitle = () => {
        let str = "chatGPT";
        let i = 0;
        let timeInterval = setInterval(() => {
            if (i % 3 == 0) {
                str = "chatGPT";
            }
            str = str + ".";
            if (isResponsing) {
                Taro.setNavigationBarTitle({ title: str });
            } else {
                Taro.setNavigationBarTitle({ title: 'chatGPT' });
                clearInterval(timeInterval)
            }
            i++;
        }, 500)
    }


    const inputing = e => {
        if (e.detail.value == "") {
            setIptValue("");
        } else {
            setIptValue(e.detail.value);
        }
    }

    const sendMessage = async () => {

        // let msgArr = messageList;
        // msgArr.push({
        //     role: 'user',
        //     content: iptValue,
        // });
        // sendData(JSON.stringify(msgArr));
        // msgArr.push({
        //     role: 'assistant',
        //     content: ''
        // });
        // setMessageList(msgArr);
        // setView(`view${msgArr.length - 1}`);
        // setRender(pre => !pre);

    }

    const renderContent = () => {
        return messageList.map((item, index) => {
            return <>
                {
                    (item.role == 'assistant') ? <View className="flexStart" id={"view" + index} style={{ width: "750rpx", height: "auto", marginTop: "50rpx" }}>
                        <View style={{ width: "65rpx", height: "65rpx", borderRadius: "50%", marginLeft: "15rpx" }}>
                            <Image style={{ width: "100%", height: "100%", borderRadius: "50%" }} src={gptImg} />
                        </View>
                        <View className="flexCenter" style={{ wordBreak: "break-word", wordWrap: "break-word", marginLeft: "15rpx", backgroundColor: "white", maxWidth: "480rpx", padding: "10rpx 10rpx 10rpx 10rpx", height: "auto", borderRadius: "7px" }}>
                            <Text style={{ wordBreak: "break-word", wordWrap: "break-word" }} user-select>{item.content}</Text>
                        </View>
                        <View className="flexCenter" style={{ width: "60rpx", height: "65rpx" }}>

                        </View>
                    </View> : <View className="flexEnd" id={"view" + index} style={{ width: "750rpx", height: "auto", marginTop: "50rpx" }}>
                        <View className="flexCenter" style={{ width: "60rpx", height: "65rpx" }}>

                        </View>
                        <View className="flexCenter" style={{ wordBreak: "break-word", wordWrap: "break-word", marginRight: "15rpx", backgroundColor: "white", maxWidth: "480rpx", padding: "10rpx 10rpx 10rpx 10rpx", height: "auto", borderRadius: "7px" }}>
                            <Text style={{ wordBreak: "break-word", wordWrap: "break-word", }} user-select>{item.content}</Text>
                        </View>
                        <View style={{ width: "65rpx", height: "65rpx", borderRadius: "50%", marginRight: "15rpx" }}>
                            <Image style={{ width: "100%", height: "100%", borderRadius: "50%" }} src={userImg} />
                        </View>
                    </View>
                }</>
        })
    }

    return <>
        <View style={{ position: "fixed", left: "0px", top: "0px", width: "750rpx", height: heightrpx + 'rpx', zIndex: "1", backgroundColor: "white" }}></View>
        <View style={{ width: "750rpx", height: 'auto', position: "relative", zIndex: "10", backgroundColor: "rgb(252,252,252)" }}>
            <ScrollView
                className='scrollview'
                scrollY
                scrollIntoView={toView}
                scrollWithAnimation
                scrollTop={scrollTop}
                style={scrollStyle}
                lowerThreshold={Threshold}
                upperThreshold={Threshold}
            >
                {
                    render ? renderContent() : renderContent()
                }
            </ScrollView>
            <View style={{ width: "750rpx", height: "130rpx" }}></View>
            <View className="flexAround" style={{ position: "fixed", bottom: "0rpx", left: "0rpx", width: "750rpx", height: "100rpx", alignItems: "center", backgroundColor: "white" }}>
                {/* <Textarea value={iptValue} adjustPosition={true} onInput={(e) => inputing(e)} cursorSpacing={15} autoFocus={false} autoHeight={true} style={{ overflow: "scroll", display: "flex", alignItems: "center", width: "80%", height: "60rpx", borderRadius: "15px", border: "1px solid rgb(254,108,57)", backgroundColor: "white" }} /> */}
                <Input value={iptValue} adjustPosition={true} onInput={(e) => inputing(e)} cursorSpacing={10} autoFocus={true} style={{ overflow: "scroll", display: "flex", alignItems: "center", width: "80%", height: "60rpx", borderRadius: "15px", border: "1px solid rgb(254,108,57)", backgroundColor: "white" }} />
                {
                    iptValue == '' ?
                        <View className="flexCenter" style={{ width: "15%", height: "60rpx", borderRadius: "15px", border: "1px solid rgb(254,108,57)", backgroundColor: "rgb(254,108,57)", opacity: "0.5", color: "white" }} >发送</View>
                        :
                        <View className="flexCenter" onClick={() => { sendMessage(); setIptValue(""); }} style={{ width: "15%", height: "60rpx", borderRadius: "15px", border: "1px solid rgb(254,108,57)", backgroundColor: "rgb(254,108,57)", color: "white" }} >发送</View>
                }
            </View>
        </View>
    </>
}