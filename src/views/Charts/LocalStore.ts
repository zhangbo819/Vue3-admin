class LocalStore {
  key: string
  constructor(key: string) {
    this.key = key;
  }

  save(value: string | any[]) {
    if (Array.isArray(value)) {
      value = JSON.stringify(value)
    }

    window.localStorage.setItem(this.key, value)
  }

  get(defVal: any) {
    try {
      const data = window.localStorage.getItem(this.key) || ''

      return JSON.parse(data)
    } catch (err) {
      console.warn(err)
      return defVal
    }
  }
}

export default new LocalStore('Charts')