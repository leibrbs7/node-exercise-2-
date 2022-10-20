/* eslint-disable */

const fs = require('node:fs')
const { argv } = require('node:process')
const csvjson = require('csvjson')

class Bio {
  constructor(name, sex, age, height, weight) {
    this.name = name
    this.sex = sex.toUpperCase()
    this.age = Number(age)
    this.height = Number(height)
    this.weight = Number(weight)
  }

  isValidName() {
    return typeof this.name === 'string'
  }

  isValidSex() {
    return 'FM'.includes(this.sex)
    && typeof this.sex === 'string'
    && this.sex.length === 1
  }

  isValidAge() {
    return !Number.isNaN(this.age)
    && this.age >= 18
  }

  isValidHeight() {
    return !Number.isNaN(this.height)
  }

  isValidWeight() {
    return !Number.isNaN(this.weight)
  }
}

const readFile = (file) => {
  const data = fs.readFileSync((file), { encoding: 'utf8' })
  const options = {
    delimiter: ',',
    quote: '""',
    headers: 'name,sex,age,height,weight',
  }

  const stats = csvjson.toObject(data, options)
  const headers = Object.keys(stats)
  const map = new Map()

  for (let i = 1; i < headers.length; i += 1) {
    map.set(stats[headers[i]].name, stats[headers[i]])
  }
  return map
}

const writeFile = (file, bioArray) => {
  try {
    const options = {
      delimiter: ',',
      quote: '""',
      headers: 'key',
    }
    fs.writeFileSync(file, csvjson.toCSV(bioArray, options), 'utf8', 'w')
    return true
  } catch {
    return false
  }
}

const create = (bioMap, bioObjectbject) => bioMap.set(bioObjectbject.name, bioObjectbject)

const read = (bioMap, bioName) => bioMap.get(`${bioName[0].toUpperCase() + bioName.substring(1).toLowerCase()}`)

const update = (bioObject, mapBio) => {
  if (mapBio.has(bioObject.name)) {
    const bioMap = mapBio
    bioMap.set(bioObject.name, bioObject)
    return bioMap
  }
  return null
}

const del = (bioMap, bioName) => bioMap.delete(bioName)

const checkError = (bioObject) => {
  let errorPrompt = []
  if (bioObject.isValidName() === false) {
    errorPrompt = [...errorPrompt, 'Name should be a string']
  }
  if (bioObject.isValidSex() === false) {
    errorPrompt = [...errorPrompt, '!!! ERROR: Invalid Sex']
  }
  if (bioObject.isValidAge() === false) {
    errorPrompt = [...errorPrompt, '!!! ERROR: Invalid Age']
  }
  if (bioObject.isValidHeight() === false) {
    errorPrompt = [...errorPrompt, '!!! ERROR: Invalid Height']
  }
  if (bioObject.isValidWeight() === false) {
    errorPrompt = [...errorPrompt, '!!! ERROR: Invalid Weight']
  }
  return errorPrompt.join(', ')
}

let [, ,choice, name, sex, age, height, weight] = argv

let bioArray = readFile('biostats.csv')

if (bioArray !== null && choice !== null) {
  switch (choice) {
    case '-c': {
      const newBio = new Bio(name, sex, age, height, weight)
      if (checkError(newBio).length !== 0) {
        console.log(`${checkError(newBio)}`)
      } else {
        bioArray = create(newBio, bioArray)
        if (bioArray === null) {
          console.log('Name already exists')
        } else {
          writeFile('biostats.csv', bioArray)
        }
      }
    }
    break
    case '-r':{
      bioArray = read(name, bioArray)
      if (bioArray === null) {
        console.log(`!!! ERROR: Data doesn't Exist`)
      } else {
        const wholeSex= bioArray.sex === 'f' ? 'Female' : 'Male'
        const display = `\n[Name]: ${bioArray.name} \n[Sex]: ${wholeSex}\n[Age]: ${bioArray.age}\n\n[Height]:\n- (in): ${bioArray.height}\n- (cm): ${bioArray.height * 2.54}\n\n[Weight]\n- in (lb):${bioArray.weight}\n- in(kg): ${bioArray.weight / 2.205}\n\n`
        console.log(display)
      }
    }
    break
    case '-u': {
      const newBio = new Bio(name, sex, age, height, weight)
      if (checkError(newBio).length !== 0) {
        console.log(`${checkError(newBio)}`)
      } else {
        bioArray = update(newBio, bioArray)
        if (bioArray === null) {
          console.log('Name does not exist')
        } else {
          writeFile('biostats.csv', bioArray)
        }
      }
      }
    break
    case '-d': {
        if (bioArray === null) {
          console.log('!!! ERROR: Data does not exist')
        } else {
          del(bioMap, name)
        }
      }
    break
    default:{
      console.log('!!! ERROR: Invalid Argument')
    break
    }
  }
}