import { StyleSheet, Text, View,Image,Button } from 'react-native'
import React from 'react'
import logo from '../assets/logo.png'


const Info = () => {
  return (
    <View style={{backgroundColor: 'blue', display:'flex',alignItems:'center',justifyContent:'center',width:'full',height:'100%'}}>
      <Image style= {{marginBottom:100}} source={logo}/>
      <Text style={{fontWeight: 'bold',color:'white',marginBottom:5}}>Welcome to SmartBus!</Text>
      <Text style= {{width:'80%',textAlign:'center',color:'white',marginBottom:40}}>Discover the smarter way to travel with real-time bus tracking at your fingertips.</Text>
      <View  color="#000000" style={{width:'80%',backgroundColor:'black',borderRadius:10,justifyContent:'center',alignItems:'center',paddingHorizontal:24, paddingVertical:12}}><Text style={{color:'white'}}>Get Started</Text></View>
    </View>
  )
}



export default Info

const styles = StyleSheet.create({})