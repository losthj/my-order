import React, { Component } from 'react';
import Request from '@utils/request';
import '@assets/event/hd2019/sign.css'
import Slider from "react-slick";
import { Layout } from 'zent';
import { MessageBox } from 'element-react';
const { Row, Col } = Layout

class Sign extends Component {
    constructor(props){
        super(props);
        this.state = {
            box_status: [],
            card_num: 0,
            has_sign: 'N',
            sign_count: 0,
            sign_miss: '',
            day_detail: [],
            boxList: [],
            signList: [],     
            display:false,
            display_box:true,
            reward_nam:[],
            reward_names:[],
            infos:[]
        }
        this.signToday = this.signToday.bind(this);
        this.signPast = this.signPast.bind(this);
        this.hide = this.hide.bind(this);
    }
    getMonthDay(){
        let date = new Date();
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        return date.getDate();
    }
    getSignInfo (){
        // 获取签到基本信息
        Request.post('/v1/sign/info').then(res => {
            this.setState({
                box_status: res.data.box_status,
                card_num: res.data.card_num,
                has_sign: res.data.has_sign,
                sign_count: res.data.sign_count,
                sign_miss: res.data.sign_miss,
                day_detail: res.data.day_detail,
            })
        })

    }
    getList(){
        // 打开宝箱列表
        Request.post('/v1/sign/boxList').then(res => {
            this.setState({
                boxList: res.data
            })
        })
        // 签到列表
        Request.post('/v1/sign/signList').then(res => {
            this.setState({
                signList: res.data
            })
        })
    }
    signToday(){

        Request.post('/v1/sign/today').then(res => {
            this.setState({
                reward_nam: res.data.reward_name,
                display: true
            }).then(() => {
                this.getSignInfo();
            }).catch(err => {console.log(err);})
        })
        // Request.post('/v1/sign/today').then(res => {
        //     MessageBox.confirm(`恭喜获得:${res.data.reward_name}`, '签到成功', {
        //         type: 'success'
        //     }).then(() => {
        //         this.getSignInfo();
        //     }).catch(err => {console.log(err);})
        // })
    }
    signPast(){
        Request.post('/v1/sign/past').then(res => {
            MessageBox.confirm(res.info, '提示', {
                type: 'success'
            }).then(() => {
                this.getSignInfo();
            }).catch(err => {console.log(err);})
        }).catch((err) => {
            MessageBox.confirm(err.info, '提示', {
                type: 'error'
            })
        })
    }
    openBox(id){
        Request.post('/v1/sign/box',{
            box: id
        }).then(res => {
            this.setState({
                display_box: true,
                reward_names: res.data.reward_name,
            // MessageBox.confirm(res.data.reward_name, res.info, {
            //     type: 'success'
            
            }).then(() => {
                this.getSignInfo();
            }).catch(err => {console.log(err);})
        }).catch((err) => {
            MessageBox.confirm(err.info, '提示', {
                type: 'error'
            })
        })
    
    }
    hide(){
        this.setState({
            display: false,
            display_box:false,
        });
        this.forceUpdate();
    }
    componentWillMount(){
        this.getSignInfo();
        this.getList();
    }
    open_box(id) {
        console.log(id);
    }
    render(){
        const { box_status, card_num, has_sign, sign_count, sign_miss, day_detail, boxList, signList,reward_nam,display,display_box,reward_names } = this.state;
        const settings1 = {
            autoplay: true,
            dots: false,
            slidesToShow: 5,
            slidesToScroll: 1,
            vertical: true,
            verticalSwiping: true,
            autoplaySpeed: 2000,
            infinite: true,
            swipeToSlide: true,
            pauseOnHover: false,
            arrows: false
          };
        return(
            <div id="doc-view">
            <div id="bg1">
                <div id="area1">
                    <img src="images/slogan.png" className="jy-pa qd-slogan" alt=""  />
                </div>
            </div>
            <div id="bg2">
                <div id="area2">
                    <div className="jy-he"></div>
                    {
                        has_sign === 'N' ?
                        <div className="lrbx-signbtn" onClick={this.signToday}>每日一签</div>
                        :
                        sign_miss !== 0 ? 
                        <div className="lrbx-repairbtn" onClick={this.signPast}>补签({sign_miss}日)</div>
                        :
                        <div className="lrbx-signbtn lrbx-signbtn1">明日再来</div>
                    }
                     {/* <div className="lrbx-repairbtn">补签(12月29日)</div> */}
                    <div className="lrbx-text jy-text-c">
                        活动期间，平台用户<b className="jy-yellow jy-fz-18">连续签到</b>可开启不同等级宝箱，宝箱中随机含有不等额的囧羊平台<b className="jy-yellow jy-fz-18">出借道具</b>， <br />
                        <p className="jy-mt-10"><b className="jy-yellow jy-fz-18">宝箱等级越高</b>，获得<b className="jy-yellow jy-fz-18"> 出借道具越多，</b>开始签到开启宝箱吧！</p>
                    </div>
                    <div className="pr">
                        <div className="lrbx-day">
                            您已连续签到<span className="fm fl">{sign_count}</span>天
                        </div>
                    </div>
                    <div className="lrbx-counts jy-text-c">
                        <p className="jy-yellow"> 您现有补签卡 {card_num} 张</p>
                    </div>
                    <div className="qd-sign">
                        <ul>
                        {
                            day_detail.slice(0, this.getMonthDay()).map((item, index) => (
                                <li 
                                    className={item === 'N' ? `qd-dark${index+1}` : `qd-dark${index+1} qd-sign${index+1}`}
                                    key={index}>
                                    {index + 1}
                                </li>
                            ))
                        }
                        </ul>
                    </div>
                    <ul className="qd-series">
                        <li className="qd-serie1">连续签到满<span>3</span>天 <br /> 开启<b className="jy-fz-20 jy-yellow">青铜</b>宝箱</li>
                        <li className="qd-serie2">连续签到满<span>7</span>天 <br /> 开启<b className="jy-fz-20 jy-yellow">白银</b>宝箱</li>
                        <li className="qd-serie3">连续签到满<span>15</span>天 <br /> 开启<b className="jy-fz-20 jy-yellow">黄金</b>宝箱</li>
                        <li className="qd-serie4">连续签到满<span>20</span>天 <br /> 开启<b className="jy-fz-20 jy-yellow">铂金</b>宝箱</li>
                        <li className="qd-serie5">连续签到满<span>25</span>天 <br /> 开启<b className="jy-fz-20 jy-yellow">钻石</b>宝箱</li>
                        <li className="qd-serie6">连续签到满<span>30</span>天 <br /> 开启<b className="jy-fz-20 jy-yellow">至尊</b>宝箱</li>
                    </ul>
                </div>
            </div>

            <div id="bg3">
                <div id="area3">
                    <div className="qd-chest">
                        <ul>
                            {
                                box_status.map((item,index) => (
                                    <li className={`qd-chest${index+1}`} key={index}>
                                        {
                                            item === 'N' ? 
                                            <div className={`chest${index+1}`} onClick={() => {this.openBox(index+1)}}> </div>
                                            :
                                            <div className={`chest${index+1}-open`}> </div>
                                        }
                                    </li>
                                ))
                            }
                           
                        </ul>
                    </div>
                </div>
            </div>
    
            <div id="bg4">
                <div id="area4">
                    <div className="jy-he"></div>
                    <div className="qd-head qd-head1">他们正在<b>签到</b></div>
                    <div className="obtain-list1 obtain-list">
                        <ul className="obtain-head clearfix">
                            <li>用户名</li>
                            <li>获得奖品</li>
                            <li>获得时间</li>
                        </ul>
                        <div className="obtain-con">
                        <Slider {...settings1} >
                            {
                                signList.map((item,index) => (
                                    <div key={index}>
                                    <Row>
                                        <Col span={8}>{item.phone}</Col>
                                        <Col span={8}>{item.prize}</Col>
                                        <Col span={8}>{item.date}</Col>
                                    </Row>
                                    </div>
                                ))
                            }
                        </Slider>
                        </div>
                      
                        </div>
                    <div className="qd-head qd-head2">他们正在开启<b>宝箱</b></div>
    
                    <div className="obtain-list2 obtain-list">
                        <ul className="obtain-head clearfix">
                            <li>用户名</li>
                            <li>获得宝箱奖品 </li>
                            <li className="last">获得时间</li>
                        </ul>
                        <div className="obtain-con">
                        <Slider {...settings1}>
                            {
                                boxList.map((item,index) => (
                                    <Row key={index}>
                                        <Col span={8}>{item.phone}</Col>
                                        <Col span={8}>{item.prize}</Col>
                                        <Col span={8}>{item.date}</Col>
                                    </Row>
                                ))
                            }
                        </Slider>
                        </div>
                    </div>
                </div>
            </div>

            <div id="bg5">
                <div id="area5">
                    <div className="jy-he"></div>
                    <div className="qd-wares">
                        <div className="hd">
                            热门商品兑换
                            <a href="http://mall.jylc168.com" target="_blank" rel="noopener noreferrer">更多>></a>
                        </div>
                        <div className="bd">
                            <ul className="picList">
                                <li>
                                  
                                    <div className="pic">
                                        <a href="http://mall.jylc168.com/goods/info/gid/Amg4Sl9oZKk2Le2KgUa1dQ" target="_blank" rel="noopener noreferrer">
                                            <img src="http://mall.jylc168.com/Upload/Mall/2017-11-23/a2095a163aa945d25.jpg@4e_0o_0l_156h_196w_90q.src" alt="" />
                                        </a>
                                    </div>
                                    <div className="title txoh">
                                        <a href="http://mall.jylc168.com/goods/info/gid/Amg4Sl9oZKk2Le2KgUa1dQ" target="_blank" rel="noopener noreferrer">
                                            Apple iPad mini 4 平板电脑 128G 
                                        </a>
                                    </div>
                                    <div className="gold">
                                        <span>796320</span> 金币
                                    </div>
                                </li>
                                <li>
                                  
                                    <div className="pic">
                                        <a href="http://mall.jylc168.com/goods/info/gid/saufgNbXeUjGny-6XhB6wA" target="_blank" rel="noopener noreferrer">
                                            <img src="http://mall.jylc168.com/Upload/Mall/2017-11-24/5bb85a1783af72c5a.jpg@4e_0o_0l_156h_196w_90q.src"  alt="" />
                                        </a>
                                    </div>
                                    <div className="title txoh">
                                        <a href="http://mall.jylc168.com/goods/info/gid/saufgNbXeUjGny-6XhB6wA" target="_blank" rel="noopener noreferrer">
                                            小米(MI) 移动电源2 10000毫安
                                        </a>
                                    </div>
                                    <div className="gold">
                                        <span>26160</span> 金币
                                    </div>
                                </li>
                                <li>
                                    <div className="pic">
                                        <a href="http://mall.jylc168.com/goods/info/gid/6nMWMqMndnu5HekFwlQW8Q" target="_blank" rel="noopener noreferrer">
                                            <img src="http://mall.jylc168.com/Upload/Mall/2019-01-02/c1595c2c5a436125c.jpg@4e_0o_0l_156h_196w_90q.src" alt="" />
                                        </a>
                                    </div>
                                    <div className="title txoh">
                                        <a href="http://mall.jylc168.com/goods/info/gid/6nMWMqMndnu5HekFwlQW8Q" target="_blank" rel="noopener noreferrer">
                                            美的（Midea） 手持蒸汽挂烫机YGD30A2J
                                        </a>
                                    </div>
                                    <div className="gold">
                                        <span>81900</span> 金币
                                        {/**<label>原价<del>9600</del>金币</label>**/}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div id="bg6">
                <div id="area6">
                    <div className="jy-he"></div>
                    <div className="kc-text">
                        活动规则
                    </div>
                    <ul className="turns-notice">
                    <li>
                    1、用户连续签到<span className="jy-yellow">第3天、7天、15天、20天、25天</span>即可<span className="jy-yellow">开启一个宝箱</span>，当月满签可开启<span className="jy-yellow">至尊宝箱</span>，每个宝箱只可开启一次；
                </li>
                <li>
                    2、若中途出现漏签情况，<span className="jy-yellow">则连续签到天数从头开始计算；</span>
                </li>
                <li>
                    3、补签可使用补签卡或500金币进行操作（优先使用补签卡），并且只能从最近漏签那天开始补签。通过补签可延长连续签到天数<br /><span className="jy-yellow">以获得相应宝箱开启资格，补签本身并不能获得奖励；</span>
                </li>
                <li>
                    4、每日签到和开启宝箱获得的奖品由系统自动发放至账户中心，可至账户中心-》奖励管理-》奖励记录中查看；
                </li>
                <li>
                    5、本月满签更可获得商城“金币大赢家”5次免费抽奖机会。 <a className="gz-btn" href="https://mall.jylc168.com/index/luck_coin">去抽奖</a>
                </li>
                    </ul>
                </div>
            </div>
            <ul className="sidebar">
                <li className="side-icon1"><a href="/">返回首页</a></li>
            </ul>
            {/**宝箱弹框**/}

                {
                    display_box ?
                    <div>
                    <div className="dialogMask"></div>
                    {
                            box_status.map((item,index) => (
                                <div className="dialog dialog2">
                                    <div className="qd-rewards">
                                        <img src="https://img.jylc168.com/Asset/User/sign/images/box/close.png" className="m-close" alt=""  onClick={this.hide} />
                                        <div className={`qd-reward qd-reward${index+1}`} >
                                            <div className="reward-head reward-head1">
                                                <p>恭喜您获得：</p>
                                                <p className="reward-type">{reward_names}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                    }
                   
                        {/* <div className="dialog dialog2">
                            <div className="qd-rewards">
                                <img src="https://img.jylc168.com/Asset/User/sign/images/box/close.png" className="m-close" alt=""  onClick={this.hide} />
                                <div className="qd-reward qd-reward1" >
                                    <div className="reward-head reward-head1">
                                        <p>恭喜您获得：</p>
                                        <p className="reward-type">{reward_names}</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                     :null
                }
            {/* // <div className="dialogMask" ></div>
            //     <div className="dialog dialog2">
            //         <div className="qd-rewards">
            //             <img src="https://img.jylc168.com/Asset/User/sign/images/box/close.png" className="m-close" alt="" onClick={this.hide} />
            //             <div className="qd-reward qd-reward1" >
            //                 <div className="reward-head reward-head1">
            //                     <p>恭喜您获得：</p>
            //                     <p className="reward-type"></p>
            //                 </div>
            //             </div>
            //             <div className="qd-reward qd-reward2" style={{display:'none'}}>
            //                 <div className="reward-head reward-head1">
            //                     <p>恭喜您获得：</p>
            //                     <p className="reward-type"></p>
            //                 </div>
            //             </div>
            //             <div className="qd-reward qd-reward3" style={{display:'none'}}>
            //                 <div className="reward-head reward-head1">
            //                     <p>恭喜您获得：</p>
            //                     <p className="reward-type"></p>
            //                 </div>
            //             </div>
            //             <div className="qd-reward qd-reward4" style={{display:'none'}}>
            //                 <div className="reward-head reward-head1">
            //                     <p>恭喜您获得：</p>
            //                     <p className="reward-type"></p>
            //                 </div>
            //             </div>
            //             <div className="qd-reward qd-reward5" style={{display:'none'}}>
            //                 <div className="reward-head reward-head1">
            //                     <p>恭喜您获得：</p>
            //                     <p className="reward-type"></p>
            //                 </div>
            //             </div>
            //             <div className="qd-reward qd-reward6"style={{display:'none'}}>
            //                 <div className="reward-head reward-head1">
            //                     <p>恭喜您获得：</p>
            //                     <p className="reward-type"></p>
            //                     <a className="cj-btn" href="https://mall.jylc168.com/index/luck_coin">免费赢大奖</a>
            //                 </div>
            //             </div>
            //         </div>
            //     </div> */}
                {
                    display ?
                    <div className="dialog dialog1" >
                    <div className="qd-rewards">
                        <a href="javascrip:;" className="m-close">
                            <img src="https://img.jylc168.com/Asset/User/sign/images/box/close.png" alt="" onClick={this.hide} />
                        </a>
                        <div className="qd-bonus jy-text-c">
                            <div className="qd-img"></div>
                            <p>恭喜您获得：</p>
                            <b className="fz24 jy-yellow">{reward_nam}</b>
                            <p className="fz18">（明天不要忘了继续签哦！）</p>
                        </div>
                    </div>
                </div> : null
                }   
               

                {/**签到弹框250金币251碎片253补签卡254囧羊券**/}
                {/**
                    todayPop ?
                    <div className="dialog dialog1">
                        <div className="qd-rewards">
                            <a href="javascrip:;" className="m-close">
                                <img src="https://img.jylc168.com/Asset/User/sign/images/box/close.png" alt="" onClick={()=>{this.todayPop(false)}}/>
                            </a>
                            <div className="qd-bonus jy-text-c">
                                <div className="qd-img"></div>
                                <p>恭喜您获得：</p>
                                <b className="fz24 jy-yellow">{todayPrize}</b>
                                <p className="fz18">（明天不要忘了继续签哦！）</p>
                            </div>
                        </div>
                    </div> 
                    : null
                **/}
                

                <div className="dialog-box" style={{display:'none'}}>
                <div className="qd-rewards">
                    <div className="qd-box chest1" style={{display:'none'}} onClick={() => {this.open_box(1)}}></div>
                    <div className="qd-box chest2" style={{display:'none'}} onClick={() => {this.open_box(2)}}></div>
                    <div className="qd-box chest3" style={{display:'none'}} onClick={() => {this.open_box(3)}}></div>
                    <div className="qd-box chest4" style={{display:'none'}} onClick={() => {this.open_box(4)}}></div>
                    <div className="qd-box chest5" style={{display:'none'}} onClick={() => {this.open_box(5)}}></div>
                    <div className="qd-box chest6" style={{display:'none'}} onClick={() => {this.open_box(6)}}></div>
                </div>
            </div>


        </div>
        )
    }
}

export default Sign;