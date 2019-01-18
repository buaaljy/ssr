import React from 'react';
import _ from 'lodash';
import request from '../../lib/request';
import { testModule } from '../../service';

class App extends React.Component {
  constructor(context) {
    super(context);
    const serverSideData = this.props.serverSideData ?
      this.props.serverSideData[0].data :
      ( window._server_side_data_  ?
        _server_side_data_[0].data
        : {}
      );
    this.state= {
      user: serverSideData,
    };
    console.log(this.state);
    console.log('constructor');
    console.log(location.href);
  }
  componentWillMount() {
    console.log('componentWillMount');
    let i = 0;
    // while (1) {
    //   i++;
    // }
  }
  componentDidMount() {
    request(testModule.getUser, {}).then((data) => {
      console.log(data);
      if (data.data) {
        this.setState({
          user: data.data
        });
      }
    });
    console.log('componentDidMount');
  }
  render() {
    console.log('render');
    return (
      <div onClick={() => {
        alert('test');  
      }}>
        <h1>React</h1>
        <h1>hello {this.state.user.userName}</h1>
        <h2>{this.state.user.userId}</h2>
      </div>
    );
  }
};

export default App;
