import React, { Component } from 'react';
import OrderItem from '../OrderItem';

// const data =[
//     {
//         id:1,
//         shop:'澳洲swisse钙片维生素D 柠檬酸钙',
//         picture:'http://img.jylc168.com/Upload/Mall/2018-10-26/222b5bd2bd6c361ee.jpg@4e_0o_0l_186h_254w_90q.src',
//         product:'保健品1瓶',
//         price:19.9,
//         ifCommented:true
//     },
//     {
//         id:2,
//         shop:'小米9 6GB+128GB',
//         picture:'http://i1.mifile.cn/a1/pms_1550642182.7527088!220x220.jpg',
//         product:'小米手机',
//         price:2999,
//         ifCommented:false
//     },
//     {
//         id:3,
//         shop:'小米9SE 6GB+64GB',
//         picture:'http://i1.mifile.cn/a1/pms_1550642182.7527088!220x220.jpg',
//         product:'小米手机',
//         price:1999,
//         ifCommented:false
//     },
//     {
//         id:4,
//         shop:'红米6A 2GB+16GB',
//         picture:'http://i1.mifile.cn/a1/pms_1528719461.20891365!220x220.jpg',
//         product:'红米手机',
//         price:549,
//         ifCommented:false
//     }
// ]



class OrderList extends Component {
    constructor(props){
        super(props)
        this.state ={
            data:[]
        }
    }

    componentDidMount(){
        fetch('/mock/order.json').then(res =>{
            if (res.ok){
                res.json().then(data => {
                    this.setState({
                        data 
                    })
                })
            }
        })
    }
    render() {
        return (
            <div>
                {
                   this.state.data.map(item => {
                        return <OrderItem key={item.id} data={item} onSubmit={this.handleSubmit} />
                    })
                }
                {/* <OrderItem data={data} /> */}
            </div>
        );
    }

    handleSubmit=(id,comment,stars)=>{
        // fetch('/saveComment').then(()=>{
  //有服务器的操作
        // })
      const newData =  this.state.data.map(item =>{
            return item.id === id ?
            {
                ...item, comment,stars,ifCommented:true
            }:item;
        });
        this.setState({
            data:newData
        })
    }
}

export default OrderList;