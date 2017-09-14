import axios from './axios.js'
import {API_ENDPOINT} from './config.js'

export function getStats () {
  return new Promise((resolve, reject) => {
    axios.get(`${API_ENDPOINT}/stats`)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function newInvestment (withdrawalAddress) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_ENDPOINT}/investment`, {
      withdrawal_address: withdrawalAddress,
      referral_address: withdrawalAddress,
      plan: 'standard'
    })
    .then(response => {
      resolve(response.data)
    })
    .catch(error => {
      reject(error)
    })
  })
}
