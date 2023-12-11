import React from 'react'
import { Field, Form, Formik } from 'formik'
import { reviewSchema } from '../schemas'
export default function ReviewForm({handleSubmit}) {
    const text ={
        '0':"This carrot's all chewed up!",
        '1': "This needs a fluffier touch!",
        '2': "This is just a hop in the middle of the meadow.",
        '3': "Better than the usual lettuce, I'd say!",
        '4': "This is thumpin' good!",
        '5': "This is hare-mazing!"
    }
  return (
    <Formik
    initialValues={{
        score: '0',
        comment:''
    }}
    onSubmit={(values, actions)=>{
        handleSubmit(values)
        actions.resetForm()
    }}
    
    validationSchema={reviewSchema}
    >
    {({values, errors, touched}) =>
        <Form>
            <Field type='radio' name='score' value='0' />
            <Field type='radio' name='score' value='1'/>
            <Field type='radio' name='score' value='2'/>
            <Field type='radio' name='score' value='3'/>
            <Field type='radio' name='score' value='4'/>
            <Field type='radio' name='score' value='5'/>
            <img src={`../images/emotes/RE_${values.score}.png`} style={{maxHeight:'75px'}}/>
            <p>{text[values.score]}</p>
            <br/>
            <Field autoComplete='off' type='text' style={{innerHeight:'100px',height:'100px', width:'300px'}} name='comment' placeholder='Enter your thoughts here' maxLength='300'/>
            <p>{values.comment.length} of 300</p>
            {errors.comment && touched.comment? (<p>{errors.comment}</p>):null}
            <br/>
            <button type='submit'>Submit Review</button>
        </Form>
    }
    </Formik>
  )
}
