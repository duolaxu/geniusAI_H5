import Taro from "@tarojs/taro";
export const baseUrl = 'https://duolago.cn';

export const screenInfo = async (callback: Function) => { // 手机屏幕信息
    const res = await Taro.getSystemInfo();
    callback(res);
}

export const getWH = async (callback: Function) => { // 手机屏幕信息
    const res = await Taro.getSystemInfo();
    console.log("屏幕信息 = ", res);
    // const width = res.windowWidth;
    // const height = res.windowHeight; // 屏幕可用高度
    const width = res.screenWidth;
    const height = res.screenHeight; // 屏幕可用高度
    // const pxTorpx: number = (750 / width); // px与rpx的换算
    // const heightRpx = height * pxTorpx; // 屏幕高度，单位rpx
    callback(width, height);
}

export const pxTorpx = async (callback: Function) => { // 手机屏幕信息
    const res = await Taro.getSystemInfo();
    const width = res.screenWidth;
    const pxTorpx = (750 / width);
    callback(pxTorpx);
}

export const getStorage = (key: string, cb: Function) => {
    Taro.getStorage({
        key,
        success: function (res) {
            cb(res.data);
        }
    })
};

export const getStorageSync = (key: string) => {
    return Taro.getStorageSync(key);
};

export const setStorage = (key: string, data: any, cb?: Function) => {
    Taro.setStorage({
        key,
        data,
        success: function (res) {
            cb && cb(res);
        }
    })
};

export const setStorageSync = (key: string, data: string) => { // 尽量不用，data只能为字符串形式
    Taro.setStorageSync(key, data);
};

export const swapTime = (str?: string) => {
    let date = str ? new Date(parseInt(str)) : new Date();
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

    let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    let strDate = Y + M + D + h + m + s;
    return strDate;
}

// 判断输入框内容是否为空
export const judgeInput = (str: string) => {
    let lent = str.length;
    if (str == "") {
        return false;
    }
    for (let i = 0; i < lent; i++) {
        if (str[i] != ' ') {
            return true;
        }
    }
    return false;
}

export const postApi = async (url: string, params: Object, header?: Object) => {
    const res = await Taro.request({
        url,
        data: params,
        method: "POST",
        header: {
            'content-type': 'application/json', // 默认值
            ...header
        },
    });
    return res;
}

export const getApi = (url: string, callback: Function, header?: Object) => {
    Taro.request({
        url: url,
        method: "GET",
        header: {
            'content-type': 'application/json', // 默认值
            ...header
        },
        success: res => {
            callback(res);
        }
    })
}