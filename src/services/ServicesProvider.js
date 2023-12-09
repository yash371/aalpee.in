import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import Swal from 'sweetalert2'
import  secureLocalStorage  from  "react-secure-storage";


export const AppContext = createContext()
const API = 'https://aalpee.in/exam_api/public/'

const ServicesProvider = ({ children }) => {
  const [userOTP, setUserOTP] = useState(null)

  const [user, setUser] = useState({}) // userDetails
  const [islogged, setLoggedIn] = useState(false) // user login State
  const [setting, setSetting] = useState({}) // setting
  const [questions,setQuestions]=useState([]) //question

  //Checking User active or not
  const checkForInactivity = () => {
    const expireTime = secureLocalStorage.getItem('expireTime')
    if (expireTime != null  && expireTime < Date.now()) {
      console.log('I AM EXpireTime:',expireTime)
      console.log('I AM Now:',Date.now())
      const questions=JSON.parse(secureLocalStorage.getItem('Questions')) || ''
      const ansSheet=JSON.parse(secureLocalStorage.getItem('ANSSHEET')) || '';
      const userInfo = JSON.parse(secureLocalStorage.getItem('User')) || ''
      // console.log("Q",questions);
      // console.log("A",ansSheet);
      // console.log("U",userInfo);
      if(questions != '' && ansSheet !='' && userInfo != '' ){
        // console.log("Best");
        let Result=0;
        questions.map((ques,index)=>{
            let ansObj=ansSheet.filter((item,i)=>item.page === index);
            if(ansObj.length > 0){
                if(ques.answer == ansObj[0].ans){
                    Result++;
                }
            }
        })
        const value={
            result:Result,
            ansSheet:ansSheet,
            questions:questions,
            user_id:userInfo.id
         }

         RESULTSAVINGAPI(value);
      }else{
        signOut();
      }
      
    
    }
  }

  //Control the User active limit
  const updateExpireTime = (time) => {
    const expireTime = Date.now() + (parseFloat(time)*60000)
    secureLocalStorage.setItem('expireTime', expireTime)
    console.log("updated:",expireTime);
  }

  //const SignOut or Exam End
  const signOut=async (log=0)=>{
    USERLOGUPDATE(log,()=>{
        setLoggedIn(false)
        secureLocalStorage.clear();
        window.location.reload();
    });
    
  }



  useEffect(() => {
    const handleContextmenu = e => {
        e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextmenu)
    return function cleanup() {
        document.removeEventListener('contextmenu', handleContextmenu)
    }
}, [ ])


  //Important
  useEffect(() => {
    const interval = setInterval(() => {
      checkForInactivity()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  //
//   useEffect(()=>{
//     updateExpireTime(0);
//   },[])

  //OTP sending API
  const OTPSENDERAPI = async (mailid, callback = e => {}) => {
    await axios
      .post(`${API}exam/otpsend`, { email: mailid })
      .then(res => {
        setUserOTP(res.data.data)
        Swal.fire({
          position: 'center',
          icon: 'info',
          title: res.data.message
        })
        callback(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  //OTP verification
  const OTPVERIFICATION = async (mailid, callback = (e) => {}) => {
    await axios
      .post(`${API}exam/otpverify`, { email: mailid })
      .then(res => {
        Swal.fire({
          position: 'center',
          icon: 'info',
          title: res.data.message
        })
        
        const userData = res.data.data.user
        const setting=res.data.data.setting;
        const questions=res.data.data.questions;
        setUser(userData)
        setSetting(setting)
        setQuestions(questions)
        secureLocalStorage.setItem('User', JSON.stringify(userData))
        secureLocalStorage.setItem('Setting', JSON.stringify(setting))
        secureLocalStorage.setItem('Questions', JSON.stringify(questions))
        secureLocalStorage.setItem('state', islogged)
        updateExpireTime(setting.exam_time)
        callback(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  //Get The Local Storage Data
  const getLocalStorageData=(callback=(log)=>{},callback2=(q)=>{})=>{
    const userInfo = JSON.parse(secureLocalStorage.getItem('User')) || ''
    if (userInfo != '') {
      setLoggedIn(true)
      setUser(userInfo)
      callback(true)
    }else{
        callback(false);
    }
    const questions=JSON.parse(secureLocalStorage.getItem('Questions')) || ''
    if(questions != ''){
        setQuestions(questions);
        callback2(questions)
    }
    else{
        callback2([])
    }

    const settings=JSON.parse(secureLocalStorage.getItem('Setting')) || ''
    if(settings != ''){
        setSetting(settings);
    }

  }

  useEffect(()=>{
    getLocalStorageData();
  },[])


  //User Log Save
  const USERLOGUPDATE=async(log,callback=()=>{})=>{
    const userInfo = JSON.parse(secureLocalStorage.getItem('User'))
    await axios.post(`${API}exam/logUpdate`,{
        user_id:userInfo.id,
        exam_log:log
    })
    .then((res)=>{
        Swal.fire({
            position: 'center',
            icon: 'info',
            title: res.data.message
          })
          callback();
    })
    .catch((err)=>{
        console.log(err);
    })
  }

  //Result Saving API
  const RESULTSAVINGAPI=async(values)=>{
    await axios
    .post(`${API}exam/resultsave`, values)
    .then(res => {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: res.data.message
      })
      signOut(2);
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <AppContext.Provider
      value={{
        OTPSENDERAPI,
        userOTP,
        OTPVERIFICATION,
        getLocalStorageData,
        islogged,
        user,
        setting,
        questions,
        USERLOGUPDATE,
        RESULTSAVINGAPI
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default ServicesProvider
