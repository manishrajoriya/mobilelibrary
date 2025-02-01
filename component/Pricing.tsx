import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import RazorpayCheckout from 'react-native-razorpay';
import { env } from 'process';


const Pricing = () => {

  

  const razorpay_key = "rzp_test_lhWJ5AoswKGJwh"
  const razorpay_key_secret = "9HYlGDmtXffM1uVzyI8rymcx"
  // console.log(razorpay_key);

  let amount = 5000;
  
  // if (!razorpay_key) {
  //   throw new Error("Razorpay key is not defined");
  // }

   var options = {
    description: 'Credits towards consultation',
    image: "https://i.imgur.com/3g7nmJC.jpg",
    currency: 'INR',
    key: razorpay_key,
    amount: amount*100,
    name: 'Acme Corp',
    order_id: '',//Replace this with an order_id created using Orders API.
    prefill: {
      email: 'gaurav.kumar@example.com',
      contact: '8764296129',
      name: 'Gaurav Kumar'
    },
    theme: {color: '#53a20e'}
  };

const handlePayment = (options : any) => {
  console.log(options);
  
   RazorpayCheckout.open(options).then((data) => {
    // handle success
    alert(`Success: ${data.razorpay_payment_id}`);
  }).catch((error) => {
    // handle failure
    alert(`Error: ${error.code} | ${error.description} | ${error}`);
  });

  }

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => {handlePayment(options)}}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Pricing

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: '#007bff',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
})