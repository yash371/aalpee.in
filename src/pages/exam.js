// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import Swal from 'sweetalert2'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { AppContext } from 'src/services/ServicesProvider'
import { useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { LoadingButton } from '@mui/lab'
import { Image } from 'mdi-material-ui'
import LinearProgress from '@mui/material/LinearProgress';
import { CircularProgress } from '@mui/material'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterPage = () => {
  // ** States
  const [values, setValues] = useState({
    password: '',
    showPassword: false
  })

  // ** Hook
  const theme = useTheme()
  const router= useRouter()

  //Context
  const {getLocalStorageData,islogged,questions,user,RESULTSAVINGAPI}=useContext(AppContext); 

  const [page,setPage]=useState(0);

  const updatePageOnLocal=()=>{
    secureLocalStorage.setItem('page', page);
  }

  const searchingPage=(callback=()=>{})=>{
    const page = secureLocalStorage.getItem('page') || '';
    if(page !=''){
        setPage(page);
    }
    else{
        callback();
    }
  }

  useEffect(()=>{
    getLocalStorageData((log)=>{
        //console.log(log);
        if(!log){
          router.push('/');
        }
    },
    (question)=>{
        //console.log(questions);
        if(question.length > 0){
            searchingPage(()=>{
                setPage(0);
                updatePageOnLocal();
            })
        }
    }
    );
  },[])

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }


  ///testing Section 
  const [partyTime, setPartyTime] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const settings=JSON.parse(secureLocalStorage.getItem('Setting')) || '';
    const userInfo = JSON.parse(secureLocalStorage.getItem('User')) || ''
    if(settings != '' && userInfo != ''){
    //console.log(userInfo);
    let ulog=new Date(userInfo.exam_start_time);
    let ulog2=new Date(userInfo.exam_start_time);
    ulog.setMinutes(ulog2.getMinutes() + parseInt(settings.exam_time));
    //console.log(ulog);
    const target = new Date(ulog);
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      setDays(d);

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      setHours(h);

      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setMinutes(m);

      const s = Math.floor((difference % (1000 * 60)) / 1000);
      setSeconds(s);

      if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
        setPartyTime(true);
      }
    }, 1000);

    return () => clearInterval(interval);

   }

  }, []);

  //option handle section 

  const [option1check,setOption1Check]=useState(false);
const [option2check,setOption2Check]=useState(false);
const [option3check,setOption3Check]=useState(false);
const [option4check,setOption4Check]=useState(false);

const [AnsSheet,setAnsSheet]=useState([]);

const handleSaveAnswer=(ans)=>{
    const ansSheet=JSON.parse(secureLocalStorage.getItem('ANSSHEET')) || '';
    //console.log("Page",page);
    if(ansSheet != ''){
       
        let newArray=ansSheet.filter((item,i)=> item.page != page);
        //console.log('log',newArray);
        let obj={
            page:page,
            ans:ans
        };
        newArray.push(obj);
        secureLocalStorage.setItem('ANSSHEET', JSON.stringify(newArray));
        setAnsSheet(newArray);
    }else{
        //console.log('log');
        let newArray=[];
        let obj={
            page:page,
            ans:ans
        };
        newArray.push(obj);
        secureLocalStorage.setItem('ANSSHEET', JSON.stringify(newArray));
        setAnsSheet(newArray);
    }

}

const updateAnsSheet=(pagenO)=>{
    const ansSheet=JSON.parse(secureLocalStorage.getItem('ANSSHEET')) || '';
    //console.log("Page",pagenO);
    if(ansSheet != ''){
        let newArray=ansSheet.filter((item,i)=> item.page === pagenO);
        //console.log("UpdateAn",ansSheet);
        switch(newArray.length > 0 ?newArray[0].ans:'JK'){
            case 'A':
                setOption1Check(true);
                setOption2Check(false);
                setOption3Check(false);
                setOption4Check(false);
                break;
            case 'B':
                    setOption1Check(false);
                    setOption2Check(true);
                    setOption3Check(false);
                    setOption4Check(false);
                    break;
            case 'C':
                    setOption1Check(false);
                    setOption2Check(false);
                    setOption3Check(true);
                    setOption4Check(false);
                    break;
            case 'D':
                    setOption1Check(false);
                    setOption2Check(false);
                    setOption3Check(false);
                    setOption4Check(true);
                    break;  
            default:
                setOption1Check(false);
                setOption2Check(false);
                setOption3Check(false);
                setOption4Check(false);        

        }
    }
}

const handleOptionClick=(option)=>{
        switch(option){
            case 1:
                setOption1Check(true);
                setOption2Check(false);
                setOption3Check(false);
                setOption4Check(false);
                handleSaveAnswer('A');
                break;
            case 2:
                    setOption1Check(false);
                    setOption2Check(true);
                    setOption3Check(false);
                    setOption4Check(false);
                    handleSaveAnswer('B');
                    break;
            case 3:
                    setOption1Check(false);
                    setOption2Check(false);
                    setOption3Check(true);
                    setOption4Check(false);
                    handleSaveAnswer('C');
                    break;
            case 4:
                    setOption1Check(false);
                    setOption2Check(false);
                    setOption3Check(false);
                    setOption4Check(true);
                    handleSaveAnswer('D');
                    break;  
            default:
                setOption1Check(false);
                setOption2Check(false);
                setOption3Check(false);
                setOption4Check(false);        

        }
}



useEffect(()=>{
    updateAnsSheet(page);
   },[])

const handlePrev=()=>{
   if(page > 0){
    setPage(page-1);
    updateAnsSheet(page-1)
   }
}

const handleNext=()=>{
    if(questions.length-1 > page){
        setPage(page+1);
        updateAnsSheet(page+1)
    }
}

const handleSelectChange=(e)=>{
 let value=parseInt(e.target.value);
 setPage(value);
 updateAnsSheet(value)
}


const datapost=()=>{
    const ansSheet=JSON.parse(secureLocalStorage.getItem('ANSSHEET')) || '';
    //console.log("USer",user);
    //console.log("AnswerSheet",ansSheet); 
    //console.log("Questions",questions);
    let Result=0;
    if(questions.length >0){
    questions.map((ques,index)=>{
        let ansObj=AnsSheet.filter((item,i)=>item.page === index);
        if(ansObj.length > 0){
            if(ques.answer == ansObj[0].ans){
                Result++;
            }
        }
    })
    //console.log("Result:",Result);

    const value={
        result:Result,
        ansSheet:ansSheet,
        questions:questions,
        user_id:user.id
     }
     RESULTSAVINGAPI(value);
   }

}

const handleSubmit=()=>{
    Swal.fire({
        title: "Do you want to Submit?",
        showDenyButton: true,
        confirmButtonText: "Submit",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            datapost();
        //   Swal.fire("Submit!", "", "success");
        } })
}




  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
        <LinearProgress variant="determinate" 
        value={(AnsSheet.length/questions.length)*100}/>
        <div className="container">
         {/* option area end */}
          {partyTime ? (
        <>
          <h1>Times Up!</h1>
        </>
      ) : (
        <>
          <div className="timer-wrapper">
            <div className="timer-inner">
              <div className="timer-segment">
                <span className="time">{hours}</span>
                <span className="label">Hours</span>
              </div>
              <span className="divider">:</span>
              <div className="timer-segment">
                <span className="time">{minutes}</span>
                <span className="label">Minutes</span>
              </div>
              <span className="divider">:</span>
              <div className="timer-segment">
                <span className="time">{seconds}</span>
                <span className="label">Seconds</span>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
          <Box sx={{ mb: 6 }}>
            <Typography>Question {page+1} Out Of {questions.length}</Typography>
            <select value={page} onChange={handleSelectChange}>
              {
                questions.map((item,i)=>(
                    <option key={i} value={i}>{i+1}</option>
                ))
              }
            </select>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5,userSelect: 'none' }}>
              {
                questions.length > 0 ?'Q. '+questions[page].questions+' ?':''
               }
            </Typography>
          </Box>
          <Box>
            {
                questions.length > 0 ?
                
                    questions[page].question_image != ''?(<>
                    <img src={questions[page].question_image}
                    style={{width:"100%",height:100}}
                    />
                    </>):(<></>):(<></>)
            }
           
          </Box>
         {/* //option area */}
         <Box sx={{display:'grid',gap:5}}>
         <OptionBox tag="A." option={questions.length > 0 ?" "+questions[page].option_a:''} active={option1check}  onClick={()=>{handleOptionClick(1)}} />
         <OptionBox tag="B." option={questions.length > 0 ?" "+questions[page].option_b:''} active={option2check}  onClick={()=>{handleOptionClick(2)}} />
         <OptionBox tag="C." option={questions.length > 0 ?" "+questions[page].option_c:''} active={option3check}   onClick={()=>{handleOptionClick(3)}} />
         <OptionBox tag="D." option={questions.length > 0 ?" "+questions[page].option_d:''} active={option4check}  onClick={()=>{handleOptionClick(4)}} />
         </Box>
         <Box sx={{display:'flex',justifyContent:'space-between',alignItem:'center',marginTop:5,marginBottom:5}}>
         <LoadingButton onClick={handlePrev}>Previous</LoadingButton>
         <LoadingButton onClick={handleNext}>Next</LoadingButton>
         </Box>
         <Button variant='contained' onClick={handleSubmit}>Submit</Button>
        
        </CardContent>
      </Card>
      
      <FooterIllustrationsV1 />
    </Box>
  )
}
RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default RegisterPage


const OptionBox=({option,tag,active,onClick})=>{
    return (
        <Box 
        onClick={onClick}
        sx={{
            cursor:'pointer',
            display: 'flex', alignItems: 'center',background:active?'green':'orange',padding:2,
        borderRadius:5,}}>
         <Typography variant="h6" sx={{userSelect: 'none'}}>{tag+"  "+option}</Typography>
        </Box>
    )
}


// const OptionWrapper=({
//     option1,
//     option2,
//     option3,
//     option4,
//     callback
// })=>{

// callback(option1check,option2check,option3check,option4check);
// return (<>

// </>)


// }