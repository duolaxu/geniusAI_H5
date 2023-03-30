import { Component, PropsWithChildren } from 'react';
import './app.css';
import "taro-ui/dist/style/components/icon.scss";
import Taro from "@tarojs/taro";

class App extends Component<PropsWithChildren> {
  render() {
    // this.props.children 是将要会渲染的页面
    return this.props.children
  }
}

export default App
