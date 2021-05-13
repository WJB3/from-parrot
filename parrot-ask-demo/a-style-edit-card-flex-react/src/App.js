 
import './App.css';

const cardStyle={
  paddingTop:'24px',
  width:'300px', 
  display:'flex',
  flexDirection:'column',
  justifyContent:'flex-start'
}

const titleStyle={
  textAlign:'left',
  letterSpacing: '0px',
  color: '#111111',
  opacity: 1,
  fontSize:'12px',
  fontWeight:'bold',
  marginBottom:'10px'
}

const contentStyle={

}

const itemStyle={
  height:'28px',
  fontSize:'14px',
  display:'flex',
  alignItems:'center'
}

const span1Style={ 
  flexShrink:0, 
  flexGrow:0,
  marginRight:8
}

const span2Style={
  flex:1,
  whiteSpace:'nowrap',
  textOverflow:'ellipsis',
  overflow:'hidden',
  textAlign:'left'
}

const span3Style={ 
  flexShrink:0, 
  flexGrow:0,
  marginLeft:8
}

function App() {
  return (
    <div className="App">
       

       <div style={cardStyle}>
          <div style={titleStyle}>
            Last Email Nofication
          </div>

          <div style={contentStyle}>
            <div style={itemStyle}>
              <div style={span1Style}>头像</div>
              <div style={span2Style}>Rethesh Boquarapu ）</div>
              <div style={span3Style}>1/28/2021</div>
            </div>
            <div style={itemStyle}>
              <div style={span1Style}>头像</div>
              <div style={span2Style}>Rethesh Boquarapu (Backst ）</div>
              <div style={span3Style}>1/28/2021</div>
            </div>
            <div style={itemStyle}>
              <div style={span1Style}>头像</div>
              <div style={span2Style}>Rethesh Boq a ）</div>
              <div style={span3Style}>1/28/2021</div>
            </div>
            <div style={itemStyle}>
              <div style={span1Style}>头像</div>
              <div style={span2Style}>Rethesh Boquarapu (Backst撒打算打算的撒打算大）</div>
              <div style={span3Style}>1/28/2021</div>
            </div>
          </div>
       </div>
    </div>
  );
}

export default App;
