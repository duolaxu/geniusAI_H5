import { View, Image, Text, ScrollView, Textarea, Button, } from "@tarojs/components";
import { baseUrl, judgeInput, getWH, postApi, setStorageSync, getStorageSync } from "../../static";
import Taro, { useDidShow } from "@tarojs/taro";
import userImg from "../../static/image/mine.jpg";
import gptImg from "../../static/image/ChatGPT.png";
import { useState, useEffect } from "react";
import Loading from "../../components/loading";
import topSearchImg from "../../static/image/topSearch.png";
import "./index.css";
import { onAppShow, onAppHide } from "@tarojs/taro-h5";

export default function Index() {
    const [heightMaxPx, setHeightMaxPx] = useState(0);
    const [widthMaxPx, setWidthMaxPx] = useState(0);
    const [iptValue, setIptValue] = useState("");
    const [messageList, setMessageList] = useState<any[]>([]);
    const [toView, setView] = useState("view0");
    const [messageTypes, setMessageTypes] = useState<any[]>([]);
    const [isPending, setPending] = useState(false);
    const [endIndex, setEndIndex] = useState<number>(10086);
    const [addRender, setAddRender] = useState(false);
    const [isAnswering, setAnswering] = useState(false);
    const [preSendTime, setSendTime] = useState(0);
    const [WS, setWS] = useState<WebSocket>();

    let outTimer;
    const [contentLength, setContentLength] = useState(0);

    useEffect(() => {
        onAppShow(() => {
            connectSocket();
        })
    }, [])

    let preTop = 0;
    let scrollTop = 0;
    const Threshold = 100;
    const scrollStyle = {
        height: `${heightMaxPx * 0.95}px`,
        width: `${widthMaxPx}px`,
    };

    const apiTypes = [
        'chatCompletion',
        'imagesGenerations',
    ]

    onbeforeunload = () => {
        WS?.close(4445, 'logOut');
    }

    onAppHide(() => {
        WS?.close(4445, 'logOut');
    })



    const connectSocket = () => {
        const ws = new WebSocket('wss://duolabest.com/djWss');
        setWS(ws);
        ws.onopen = e => {
            console.log("连接建立");
        }
        ws.onclose = e => {
            console.log("连接关闭");
            if (e.reason == 'logOut') {
            } else {
                connectSocket();
            }
        }
        ws.onmessage = res => {
            setContentLength(pre => ++pre);
            test++;
            setTimeout(() => {
                setPending(false);
                let timer = JSON.parse(res.data)?.outTimer;
                clearTimeout(timer);
                let data = JSON.parse(res.data)?.message?.replaceAll('data: ', "");
                let lent = messageList.length - 1;

                let arr = data.split("\n");
                arr = arr.filter(item => item != "");
                let msgArr = messageList;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] == '[DONE]' || arr[i] == "DONE_OVER") {
                        setAnswering(false);
                        test = 0;
                    } else {
                        let str = "";
                        try {
                            str = JSON.parse(arr[i])?.choices[0]?.delta?.content;
                            if (msgArr[lent].content == '') {
                                if (str == "\n\n") {
                                    str = "";
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        let letter = str != undefined ? str : '';
                        msgArr[lent].content = msgArr[lent].content + letter;
                    }
                }

                setMessageList(msgArr);
                let numIndex = Math.random() * 100000;
                setEndIndex(parseInt(numIndex.toString()));

                const obj = Taro.createSelectorQuery();
                let scrollView = obj.select(".scroll_view");
                scrollView.boundingClientRect(res => {
                    let resTop = Math.floor(res.top);
                    if (preTop != resTop) {
                        preTop = resTop;
                        setAddRender(pre => !pre);
                    }
                }).exec()
            }, 20 * test);
        }
        ws.onerror = e => {
            console.log("连接出错 = ", e);
        }
    };

    let test = 0;
    useEffect(() => {
        if (contentLength == 0) {
            test = 0;
        }
    }, [contentLength])

    useDidShow(() => {
        getWH((w, h) => {
            setWidthMaxPx(w);
            setHeightMaxPx(h);
            console.log(w, typeof w);
            console.log(h, typeof h);
        })
        connectSocket();
    })

    const sendData = data => {
        console.log("数据 = ", data);
        WS?.send(data);
    }

    useEffect(() => {
        setView("view" + endIndex);
    }, [addRender])

    const inputing = e => {
        if (e.detail.value == "") {
            setIptValue("");
        } else {
            setIptValue(e.detail.value);
        }
    }

    const topSearchTitle = [
        {
            content: '如何理解乡愁',
            id: "key1"
        },
        {
            content: '婚姻的本质是什么',
            id: "key2"
        }, {
            content: '你可以帮我解决哪些问题',
            id: "key3"
        },
        {
            content: '父母与孩子应该如何进行交流',
            id: "key4"
        },
        {
            content: '一只鲸鱼为什么会在草原上奔跑',
            id: "key5"
        },
        {
            content: '有哪些高效的沟通技巧',
            id: "key6"
        },
        {
            content: '如何成为语言表达能力极强的人',
            id: "key7"
        },
        {
            content: '为什么那么多人选择躺平',
            id: "key8"
        },
        {
            content: '存款达到多少可以选择躺平',
            id: "key9"
        }
    ]

    const renderTopSearch = () => {
        return topSearchTitle.map((item, index) => {
            return <View key={item.id}>
                <View onClick={() => { sendMessage(item.content); }} style={{ width: "100%", height: "45px", display: "flex", alignItems: "center" }}>
                    <Image src={topSearchImg} style={{ width: "30px", height: "30px" }} />
                    <Text style={{ paddingLeft: "10px" }} >{item.content}</Text>
                </View>
            </View>
        })
    }

    const sendMessage = async (val) => {
        setContentLength(0);
        let geniusMessages = getStorageSync("geniusMessages");
        setStorageSync("geniusMessages", geniusMessages + val + '@$&');
        if (judgeInput(val)) {
            outTimer = setTimeout(() => {
                WS?.close(4444, 'timeout');
                setAnswering(false); // 事件触发代表服务器半分钟无响应，此时可认为请求出错
                setPending(false);
                let msgArr = messageList;
                msgArr[msgArr.length - 1].content = '当前服务器繁忙, 你可尝试重新发起会话~';
            }, 30000)
            setPending(true);
            setAnswering(true);
            let msgArr = messageList;
            msgArr.push({
                role: 'user',
                content: val,
            });
            let messageTypeArr = messageTypes;
            messageTypeArr.push('text');
            setMessageTypes(messageTypeArr);
            sendData(JSON.stringify({
                msgArr,
                apiType: apiTypes[0],
                outTimer
            }));
            msgArr.push({
                role: 'assistant',
                content: ''
            });
            setMessageList(msgArr);
            let numIndex = Math.random() * 100000;
            setEndIndex(parseInt(numIndex.toString()));
            setAddRender(pre => !pre);
        } else {
            Taro.showToast({
                title: '输入内容不能为空~',
                icon: 'none',
                duration: 2000
            })
        }
    }

    const renderContent = () => {
        return messageList.map((item, index) => {
            return <View key={index}>
                {
                    (item.role == 'assistant') ?
                        <View className="flexStart" id={"view" + index} style={{ width: `${widthMaxPx}px`, height: "auto", marginTop: "20px" }}>
                            <View style={{ width: "30px", height: "30px", borderRadius: "50%", marginLeft: "8px", backgroundColor: "white" }}>
                                <Image style={{ width: "30px", height: "30px", borderRadius: "50%" }} src={gptImg} />
                            </View>
                            <View className="flexCenter" style={{ wordBreak: "break-word", wordWrap: "break-word", marginLeft: "8px", maxWidth: `${widthMaxPx * 0.6}px`, padding: "8px 5px 8px 10px", height: "auto", borderRadius: "7px" }}>
                                {
                                    isPending && index == (messageList.length - 1) ? <Loading desc={'回答正在生成中~'} /> : <Text style={{ wordBreak: "break-word", wordWrap: "break-word" }} selectable={true} userSelect={true}>{item.content}</Text>
                                }
                            </View>
                            <View className="flexCenter" style={{ width: "60px", height: "1px", }}>

                            </View>
                        </View>
                        :
                        <View className="flexEnd" id={"view" + index} style={{ width: `${widthMaxPx}px`, height: "auto", marginTop: "20px" }}>
                            <View className="flexCenter" style={{ width: "60px", height: "1px", }}>

                            </View>
                            <View className="flexCenter" style={{ wordBreak: "break-word", wordWrap: "break-word", marginRight: "8px", backgroundColor: "rgb(245,245,245)", maxWidth: `${widthMaxPx * 0.6}px`, padding: "8px 5px 8px 10px", height: "auto", borderRadius: "7px" }}>
                                <Text style={{ wordBreak: "break-word", wordWrap: "break-word" }} selectable={true} userSelect={true}>{item.content}</Text>
                            </View>
                            <View style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "8px", backgroundColor: "white" }}>
                                <Image style={{ width: "30px", height: "30px", borderRadius: "50%" }} src={userImg} />
                            </View>
                        </View>
                }</View>
        })
    }

    const uploadImg = () => {
        Taro.chooseImage({
            success(res) {
                const tempFilePaths = res.tempFilePaths;
                // setHeadImg(tempFilePaths[0]);
                Taro.uploadFile({
                    url: `${baseUrl}/djServer/uploadImg`,
                    filePath: tempFilePaths[0],
                    name: 'file',
                    header: {
                        openId: getStorageSync("openId"),
                        imgName: getStorageSync("openId"),
                        contentType: 'multipart/form-data',
                        imgType: '0',
                    },
                    success: async res => {
                        let result = JSON.parse(res.data);
                        const data = await postApi(`${baseUrl}/updateUserInfo`, {
                            openId: getStorageSync("openId"),
                            userImg: result.url,
                        }, { infoType: 0 })
                    }
                })
            }
        })
    }

    return <>
        <View style={{ position: "fixed", left: "0px", top: "0px", width: "100vw", height: heightMaxPx + 'px', zIndex: "1", backgroundColor: "white" }}></View>

        <View style={{ width: `${widthMaxPx}px`, height: 'auto', position: "relative", zIndex: "10", backgroundColor: "white", fontSize: "15px" }}>
            <ScrollView
                className='scrollview'
                scrollY={true}
                scrollX={true}
                scrollIntoView={toView}
                scrollWithAnimation={false}
                scrollAnchoring={true}
                scrollTop={scrollTop}
                style={scrollStyle}
                lowerThreshold={Threshold}
                upperThreshold={Threshold}
            >
                <View key="abc" className="flexStart" style={{ width: `${widthMaxPx}px`, height: "auto", marginTop: "20px" }}>
                    <View style={{ width: "30px", height: "30px", borderRadius: "50%", marginLeft: "8px", backgroundColor: "white" }}>
                        <Image style={{ width: "30px", height: "30px", borderRadius: "50%" }} src={gptImg} />
                    </View>
                    <View className="flexCenter" style={{ wordBreak: "break-word", wordWrap: "break-word", marginLeft: "8px", backgroundColor: "rgb(245,245,245)", maxWidth: `${widthMaxPx * 0.6}px`, padding: "8px 5px 8px 10px", height: "auto", borderRadius: "7px" }}>
                        你好, 欢迎来到AI世界, 我可以解答你的任何问题, 我也可以成为你的知心朋友, 赶快和我一起聊天吧~
                    </View>
                    <View className="flexCenter" style={{ width: "60px", height: "65px" }}>

                    </View>
                </View>
                <View key="def" className="flexCenter" style={{ width: "100%", height: "auto", marginTop: "20px" }}>
                    <View key="mfs" style={{ width: "80%", height: "auto", backgroundColor: "rgb(253,244,242)", borderRadius: "7px" }}>
                        {topSearchTitle.length == 0 ? renderTopSearch() : renderTopSearch()}
                    </View>
                </View>
                <View id={"view" + endIndex} className="scroll_view" style={{ width: `${widthMaxPx}px`, height: `${heightMaxPx * 0.01}px`, marginTop: "70px", position: "relative", }}></View>

                {
                    renderContent()
                }
            </ScrollView>

            <View className="flexAround" style={{ position: "fixed", bottom: "20px", left: "0px", width: `${widthMaxPx}px`, height: "auto", alignItems: "center", }}>
                <View className="flexCenter" style={{ paddingBottom: "10px", paddingTop: "10px", width: "300px", height: 'auto', backgroundColor: "rgb(245,245,245)", borderRadius: "100px", fontSize: "30px" }}>
                    <Textarea placeholder="向Genius AI提问…" maxlength={100} disableDefaultPadding={true} focus={false} fixed={false} cursor={0} selectionStart={-1} selectionEnd={-1} showConfirmBar={false} value={iptValue} autoHeight={true} adjustPosition={true} onInput={(e) => inputing(e)} cursorSpacing={0}
                        style={{
                            width: "85%", caretColor: "yellow", backgroundColor: "", maxHeight: "100px",
                            resize: "vertical",
                            height: "20px"
                        }}
                    />
                </View>
                {

                    isAnswering ?
                        <View className="flexCenter viewBtn" style={{ opacity: "0.5" }} >回答中</View>
                        :
                        <View className="flexCenter viewBtn" onClick={iptValue == "" ? () => { } : () => {
                            let nowTime = Date.now();
                            if (nowTime - preSendTime >= 500) {
                                sendMessage(iptValue); setIptValue("");
                                setSendTime(nowTime);
                            }
                        }} style={iptValue == "" ? { opacity: '0.5' } : {}} >发送</View>
                }
            </View>
            <View style={{ position: "fixed", bottom: "0px", left: "0px", width: `${widthMaxPx}px`, height: "10px", backgroundColor: "white" }} >
            </View>
        </View>
    </>
}