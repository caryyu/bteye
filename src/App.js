import React from 'react';
const configs = require('./source/');

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      keyword: document.querySelector('h1 span').textContent,
      items: []
    }
  }

  async componentDidMount() {
    this.refreshData()
  }

  async refreshData() {
    this.setState({items:[]})
    var keyword = this.state.keyword
    var elements = []
    for (var i = 0; i < configs.length; i++) {
      var c = configs[i]
      var s = c
      
      if (!s.enabled) continue

      var k = c.filterKeyword(keyword)
      if (k.length <= 0) continue

      console.log(k)

      var data = await s.execute(k).catch(function (error) {
        console.log(error)
      })

      if (!data || data.length <= 0) {
        continue
      } 

      elements.push(data.map(i => Object.assign({site: s.site}, i)))
    }

    if(elements.length > 0) this.setState({items: elements.flat()})
  }

  changeKeyword() {
    var keyword = prompt('The keyword, More accurate, More expected', this.state.keyword)
    if(keyword) this.setState({keyword})
  }

  get getUIToolBar() {
    return (
      <div style={style.toolbar}>
        [bteye-btdouban] 
        <a onClick={() => this.refreshData()}>[Refresh]</a> | 
        keyword: [<a onClick={() => this.changeKeyword()}>{this.state.keyword}</a>]
      </div>
    )
  }

  render() {
    return (
      <div className="clearfix magnet-section" style={style.section}>
        {this.getUIToolBar}
        {this.state.items.length <= 0 ? 
          <span>[bteye-btdouban] Loading Loading Loading ...</span>
          :
          <ul> 
          {
            this.state.items.map((item, i) => {
              let {site, title, size, sd, lc, link} = item
              return (
                <li key={`bt-item-${i}`}>[{site}] <a href={link}>{title} (sd: {sd}, lc: {lc}, {size})</a></li>
              )
            })
          }
          </ul>
        }
      </div>
    )
  }
}

const style = {
  toolbar: {
    fontSize: "12px",
    //font-style:
    fontWeight: "normal",
    marginBottom: "10px",
    borderBottom: "1px #cccccc dashed"
  },
  section: {
    float: 'left',
    width: '675px',
    maxHeight: '500px',
    overflowY: 'scroll',
    border: '1px #cccccc solid',
    padding: '10px'
  }
}
