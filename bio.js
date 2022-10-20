const fs = require('node:fs')
const { argv } = require('node:process')
const csvjson = require('csvjson')

class Bio {
  constructor(name, sex, age, height, weight) {
    this.name = name
    this.sex = sex
    this.age = age
    this.height = height
    this.weight = weight
  }
}

const readFile = (file) => {
  const data = fs.readFileSync((file), { encoding: 'utf8' })
  const options = {
    delimiter: ',',
    quote: '""',
    headers: 'name,sex,age,height,weight',
  }
  return csvjson.toObject(data, options)
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

const create = (bioObject, bioArray) => [...bioArray, bioObject]

const read = (bioObject, bioArray) => bioArray.find((bio) => bio.name === bioObject)

const update = (bioObject, bioArray) => {
  if (bioArray.find((bio) => bio.name === bioObject.name)) {
    const index = bioArray.findIndex((bio) => bio.name === bioObject.name)
    const { name } = bioObject
    const { sex } = bioObject.sex
    const { age } = bioObject.age
    const { height } = bioObject.height
    const { weight } = bioObject.weight
    bioArray[index] = {...bioArray[index], name, sex, age, height, weight,}
    return bioArray
  }
  return null
}

const del = (bioObject, bioArray) => bioArray.filter((bio) => bio.name !== bioObject)

let [, ,choice, name, sex, age, height, weight] = argv

let bioArray = readFile('biostats.csv')

if (bioArray !== null && choice !== null) {
  switch (choice) {
    case '-c': {
      if (sex.toLowerCase() !== 'f' && sex.toLowerCase() !== 'm') { 
        console.log('!!! ERROR: Invalid Sex')
      }
      if (age < 18 || isNaN(age) === true){
        console.log('!!! ERROR: Invalid Age')
      }
      if (isNaN(height) === true) { 
        console.log('!!! ERROR: Invalid Height')
      }
      if (isNaN(weight) === true) { 
        console.log('!!! ERROR: Invalid Weight')
      } else {
        name = name[0].toUpperCase() + name.substring(1)
        sex = sex.toUpperCase()
        const newBio = new Bio(name, sex, age, height, weight)
        bioArray = create(newBio, bioArray)
        if (bioArray === null) {
          console.log(`!!! ERROR: Data doesn't Exist`)
        } else {
          bioArray.slice()
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
      if (sex.toLowerCase() !== 'f' && sex.toLowerCase() !== 'm') { 
        console.log('!!! ERROR: Invalid Sex')
      }
      if (age < 18 || isNaN(age) === true){
        console.log('!!! ERROR: Invalid Age')
      }
      if (isNaN(height) === true) { 
        console.log('!!! ERROR: Invalid Height')
      }
      if (isNaN(weight) === true) { 
        console.log('!!! ERROR: Invalid Weight')
      } else {
        name = name[0].toUpperCase() + name.substring(1)
        sex = sex.toUpperCase()
        const newBio = new Bio(name, sex, age, height, weight)
        bioArray = update(newBio, bioArray)
        if (bioArray === null) {
          console.log(`!!! ERROR: Data doesn't Exist`)
        } else {
          bioArray.slice()
          writeFile('biostats.csv', bioArray)
        }
      }
    }
    break
    case '-d': {
        bioArray = del(name, bioArray)
        if (bioArray === null) {
          console.log('!!! ERROR: Data does not exist')
        } else {
          bioArray.slice()
          writeFile('biostats.csv', bioArray)
        }
      }
    break
    default:{
      console.log('!!! ERROR: Invalid Argument')
    break
    }
  }
}