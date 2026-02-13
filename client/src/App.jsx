import { ConfigProvider } from 'antd';
import './App.css';
import AppRouter from './router/AppRouter';
import theme from './themes/token';

const App = () => {
  return (
    <>
      <ConfigProvider theme={theme}>
        <AppRouter />
      </ConfigProvider>
    </>
  )
}

export default App

