
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { TRANSACTION_API } from '../../../../APIS';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Spinner, Table } from 'react-bootstrap';
import { MdCancel } from 'react-icons/md';
import { Image } from 'antd';
import { useNavigate } from 'react-router-dom';






const AddTransaction = () => {

  const [consumers, setRows] = useState([{id: '', share: ''}])
  const [type, setType] = useState('')
  const [isFinance, setIsFinance] = useState('')
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()


    const handleImageChange = (e) => {
    if (e.target.files){
      const filesArray = Array.from(e.target.files);
      filesArray.forEach(file =>{
        const reader = new FileReader();      
  
        reader.readAsDataURL(file); // base64
  
        reader.onloadend = () => {
          setFiles((prevFiles) => [...prevFiles, reader.result]);
        };
      })
    }
	};


  const handleFinanceChange = (event) => {
    setIsFinance(event.target.value);
  };
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleRowsChange = (index, field, value) => {
    const updatedRows = [...consumers]
    updatedRows[index][field] = value
    setRows(updatedRows)
  }

  const addRow = () => {
    setRows([...consumers, {id: '', share: ''}])
  }


  const validationSchema = yup.object({
    amount: yup
    .string('')
    .required('برجاء تحديد المبلغ')
    .trim(),
    targetDescription: yup
    .string('')
    .trim(),
    depositeSource: yup
    .string(''),
    consumers: yup
    .array(''),
    seedsType: yup
    .string('')
  });
  
  const formik = useFormik({
    initialValues: {},
    validationSchema: validationSchema,
    onSubmit: (values) => { 
  
        setLoading(true)
  
  fetch(TRANSACTION_API, {method: "POST", 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({amount: values.amount, 
                                  type, 
                                  isFinance,
                                  ...(!isFinance && {seedsType: values.seedsType}),
                                  ...(type === 'outgoing' ? {targetDescription: values.targetDescription, consumers} : {depositeSource: values.depositeSource}),
                                  ...(files.length > 0 && {images: files})
                                }),
            credentials: 'include'})
  .then( res => res.json())
  .then( data => {
      if(data.success){
        navigate('/dashboard/transactions')
         Swal.fire({
           icon: "success",
           title: data.data
                   });
                 } else {
                   Swal.fire({
                     icon: "error",
                     title: data.data,
                   });
                 }
                 
                 setLoading(false)
       })
 },
  });


  const steps = [
    {
      label: <div className='mx-auto text-center col-12'> برجاء اختيار بيانات التحويل </div>,
      description: <><FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">نوع الحوالة</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={isFinance}
          label="Age"
          onChange={handleFinanceChange}
        >
          <MenuItem value={true}>نقدى</MenuItem>
          <MenuItem value={false}>زروع</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">نوع التحويل</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          label="Age"
          onChange={handleTypeChange}
        >
          <MenuItem value={'outgoing'}>صرف</MenuItem>
          <MenuItem value={'incoming'}>إيداع</MenuItem>
        </Select>
      </FormControl></>
    },
    {
      label: <div className='text-center mx-auto col-12'> برجاء إكمال بيانات التحويل </div>,
      description: <form onSubmit={formik.handleSubmit} className='flex flex-wrap gap-y-3 bg-white rounded-lg p-2' dir='rtl'>
      <div className='col-12 col-md-6 col-lg-5 px-2'>
        <TextField
          id="amount"
          name="amount"
          label={isFinance? 'المبلغ': 'الكمية'}
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.amount && Boolean(formik.errors.amount)}
          helperText={formik.touched.amount && formik.errors.amount}
          variant="standard"
          fullWidth
          InputLabelProps={{
            style: {
              left: 'auto'
            },
          }}
        />
      </div>
      <div className='col-12 col-md-6 col-lg-5 px-2'>
        {type === 'outgoing' ? 
        <TextField
        id="targetDescription"
        name="targetDescription"
        label="الهدف"
        value={formik.values.targetDescription}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.targetDescription && Boolean(formik.errors.targetDescription)}
        helperText={formik.touched.targetDescription && formik.errors.targetDescription}
        variant="standard"
        fullWidth
        InputLabelProps={{
          style: {
            left: 'auto'
          },
        }}
      />
      : 
      <TextField
          id="depositeSource"
          name="depositeSource"
          label="المصدر"
          value={formik.values.depositeSource}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.depositeSource && Boolean(formik.errors.depositeSource)}
          helperText={formik.touched.depositeSource && formik.errors.depositeSource}
          variant="standard"
          fullWidth
          InputLabelProps={{
            style: {
              left: 'auto'
            },
          }}
        />}
      </div>
      {!isFinance && <div className='col-12 col-md-6 col-lg-2 px-2'>
        <TextField
          id="seedsType"
          name="seedsType"
          label="نوع الزرعة"
          value={formik.values.seedsType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.seedsType && Boolean(formik.errors.seedsType)}
          helperText={formik.touched.seedsType && formik.errors.seedsType}
          variant="standard"
          fullWidth
          InputLabelProps={{
            style: {
              left: 'auto'
            },
          }}
        />
      </div>}
      {type === 'outgoing' &&  <div className='col-12 px-2 text-center'>
        <Table bordered striped hover>
          <thead>
            <tr>
              <th>رقم</th>
              <th>الرقم القومى</th>
              <th>الحصة</th>
            </tr>
          </thead>
          <tbody>
            {consumers?.map((row, i)=>(
              <tr key={i}>
                <td>{i}</td>
                <td>
                  <input type="text" value={row.id} onChange={(e) => handleRowsChange(i, 'id', e.target.value)} />
                </td>
                <td>
                  <input type="text" value={row.share} onChange={(e) => handleRowsChange(i, 'share', e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={()=> addRow()}> إضافة صف </Button>
      </div>}

      <div className="col-12">
            <input
              type="file"
              multiple
              accept='image/*' 
              onChange={handleImageChange}
              id='images'
            />
            </div>
            <div className="col-12 flex flex-wrap">
              {files.map((img, i) => (
                <div key={i}>
                  <MdCancel onClick={() => setFiles(files.filter(file => file !== img))} className='cursor-pointer text-[#0c969c]'/>
                  <Image src={img} width={100} height={100} />
                </div>
              ))}
            </div>

            <Button type='submit' variant='contained' color='primary' > إضافة التحويل </Button>
          
      </form>
    }
  ];

  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


          useEffect(()=> {
            // if(type !== '' && isFinance !== ''){
            //   setFirstDisable(false)
            // }

            // if(formik.values.amount){
            //   setSecondDisable(false)
            // }

            // // if(type === 'outgoing' && formik.values.targetDescription && formik.values.consumers && !formik.errors.targetDescription
            // //   && !formik.errors.consumers
            // // ){
            // //   setSecondDisable(false) 
            // // }

            // // if(type === 'incoming' && formik.values.depositeSource && !formik.errors.depositeSource
            // // ){
            // //   setSecondDisable(false) 
            // // }
          }, [formik.values, formik.errors])

          if(loading){
          return <div className='flex justify-center items-center h-96'>
                    <Spinner animation="border" variant="primary" />
                  </div>
        }


  return (
    <div>
  <div className='col-12'>
    <Box sx={{ flexGrow: 1 }} dir='ltr'>
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography>{steps[activeStep].label}</Typography>
      </Paper>
      <Box sx={{width: '100%', p: 2, display: 'flex'}}>
        {steps[activeStep].description}
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        className='mb-3'
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={type ==='' || isFinance === '' || activeStep === 1}
          >
            التالى
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            رجوع
          </Button>
        }
      />
    </Box>
  </div>


    </div>
  )
}

export default AddTransaction