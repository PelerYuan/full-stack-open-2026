import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  return (await axios.get(baseUrl)).data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  return (await axios.post(baseUrl, newObject, config)).data
}

const update = async newObject => {
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject)
  return response.data
}

const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, setToken, create, update, remove }