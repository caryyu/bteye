export default function render() {
  return (
    <div className="clearfix magnet-section" style={style.section}>
      <span>[bteye-btdouban] Loading Loading Loading ...</span>
    </div>
  )
}

const style = {
  section: {
    float: 'left',
    width: '675px',
    maxHeight: '500px',
    overflowY: 'scroll',
    border: '1px #cccccc solid',
    padding: '10px'
  }
}
