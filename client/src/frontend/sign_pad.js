import React, { Component } from 'react'
import SignaturePad from 'react-signature-canvas'
import call from './service';    
import styles from './styles.module.css'
class About extends Component {
  state = {trimmedDataURL: null}
  value = {data: null}
  sigPad = {}
  clear = () => {
    this.sigPad.clear()
  }
  trim = () => {
    var url_string = (window.location.href);
    var url = new URL(url_string);
    var signer_id = url.searchParams.get('id');
    this.setState({trimmedDataURL: this.sigPad.getTrimmedCanvas()
      .toDataURL('image/png')})
      call('POST', 'signimage',{'imagebase64':this.sigPad.getTrimmedCanvas()
     .toDataURL('image/png'),'fileHash': 'ba48df56abf360af7098d085058079ed','signer_id':signer_id}).then((result) => {
       console.log('post request result:', result);
     }).catch(err => {
       console.log("conn:", err)
     })
    //  call('POST', 'addsign/522',).then((result) => {      
    //  }).catch(err => {
    //    console.log("conn:", err)
    //  })
  }
  render () {
  let {trimmedDataURL} = this.state
  return <div className={styles.container}>
    <div className={styles.sigContainer}>
      {console.log("hello")}
      <SignaturePad canvasProps={{className: styles.sigPad}}
        ref={(ref) => { this.sigPad = ref }} />
    </div>
    <div>
      <button className={styles.buttons} onClick={this.clear}>
        Clear
      </button>
      <button className={styles.buttons} onClick={this.trim}>
        Submit
      </button>
    </div>
    {trimmedDataURL
      ? <img className={styles.sigImage}
        src={trimmedDataURL} />
      : null}
  </div>
  }
}
export default About;