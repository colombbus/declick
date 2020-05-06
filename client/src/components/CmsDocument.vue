<template lang="pug">
//- Uncomment when ready to clean-up.
//- div
//-   .cms-document-loading-message
//-     img(src="assets/images/spinner.gif")
//-     p Chargement...
//-   .cms-document-content
#contentContainerHome
  #onLoadGif
    img(src="../assets/images/spinner.gif")
    p Chargement...
  #content
</template>

<script>
/* eslint-disable */
/* global $ */

import config from '@/assets/config/declick'
import axios from 'axios'

export default {
  data(){
    return {
      interval:null
    } 
  },
  async created () {

    let id =  2 ;

    let router = this.$router
    window.goTo = function (event, location) {
      router.push(location)
      event.preventDefault()
    }

    let url = config.cmsUrl +
      'api/1/tables/pages/rows/' +
      id +
      '?access_token=jWNoVhWCng6odNLK';

    let {data:{content}} = await axios({
      method:"get",
      url
    })

    document.querySelector('#content').setAttribute('style','display:none');
    document.querySelector('#content').innerHTML += content;
    this.fadeOut()
  },
  methods:{
    fadeOut(){
      let target = document.querySelector('#onLoadGif')
      
      target.style.opacity = 1

      this.interval = setInterval(()=>{
        if (target.style.opacity > 0) {
          target.style.opacity -= 0.1;
        } else if (target.style.opacity == 0) {
          
          console.log("END fadeOut");
          target.setAttribute('style','display:none')

          clearInterval(this.interval);

          this.fadeIn(document.querySelector('#content'))
        }

      },40)
    },
    fadeIn(target){

      target.setAttribute('style','display:block')
      target.style.opacity = 0;
      let counter = 0;
      this.interval = setInterval(() =>{

          if (counter < 1) {
            counter += 0.1;

            target.style.opacity = counter
            
          } if (counter == 1 ) {

            console.log("END fadeIn");

            clearInterval(this.interval)
          }
        },40)
      
    }
  }
}

</script>

<style>
#content .hidden {
  display:none;
}

.cms-document-loading-message img {
  height: 50px;
}

.cms-document-loading-message p {
  font-weight: bold;
}

/* TODO: Clean this up. */
  #onLoadGif{
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #onLoadGif img{
    height: 50px
  }
  #onLoadGif p{
    font-weight: bolder;
  }


  #content {text-align:justify;font-family: "DejaVu Sans",Helvetica,Arial,sans-serif;}


  #content p
  {margin-left:100px;margin-right:100px;}

  #content table,
  #enseignants-animateurs #content table
  {padding-left:100px;padding-right:100px;box-sizing:border-box;width:initial;}

  #content table a
  {display:block;text-decoration:none;color:#480a2a;margin:10px 0;text-align:center;}

  #content table a:hover,
  #content table a:active
  {display:block;text-decoration:none;color:#ba0000;}

  #content h1 {font-size:24pt;line-height:40px;letter-spacing:-2px;margin:30px 0 40px 0;text-align:left;text-transform:uppercase;font-family:"rubik";text-align:center;font-weight:500}
  #content h1 {text-align:center;margin-left:100px; margin-right:100px;}
  #content h2 {font-size:19pt;line-height:37px;letter-spacing:-1px;margin:150px 0 90px 0;text-transform: uppercase;font-family:'rubik';color:#FFFFFF; background-color:#480A2A;text-align:center;position:relative;}
  #content h3 {font-family:arial;font-size:18px;margin:20px 0 7px 0;text-transform: uppercase;font-weight:600;}
  #content h4 {font-family:arial;font-size:16px;color:#1a1a1a;margin:25px 0 10px 0;}
  #content h5 {font-family:arial;font-size:14px;color:#1a1a1a;margin:25px 0 10px 0;}
  #content h6 {font-family:arial;font-size:10px;color:#1a1a1a;margin:25px 0 10px 0;}

  #content .page-text {font-size:16px;line-height:22px;}
  #content .page-text p, #content .page-text ul, #content .page-text ol {margin:0 0 22px 0;}
  #content .page-text ul, #content .page-text ol {margin-left:25px;}
  #content .page-text ul ul, #content .page-text ol ul, #content .page-text ul ol, #content .page-text ol ol {
    margin:0 0 0 25px;
  }
  #content .page-text blockquote {
    margin:0 0 22px 20px;
    line-height: 19px;
    font-size:13px;
    color:#666;
    font-style:italic;
    border-left:2px solid #ccc;
    padding:0 0 0 15px;
    }
  /*
  #content code {border:1px dotted #ececec;padding:2px;font-family: Consolas, Monaco, "Courier New", Courier, monospace;font-size: 12px;background:#f9f9f9;color:#000;}
  #content pre code {line-height:17px;padding:15px;border:1px dotted #ececec;font-family: Consolas, Monaco, "Courier New", Courier, monospace;font-size: 12px;background:#f9f9f9;color:#000;margin-bottom:22px;display:block;}
  */


  #content .page-text img {margin:0 0 0 0;border:none;vertical-align:bottom;}
  .code-declick {
    background-color: #d7d7d7;
      border-radius: 18px;
      padding: 28px;
    width:500px;
  }
  a#declick{
  color:#e47637;
  }
  a#declick:hover{
  color:red;
  }

  #box-content {
    max-height:200px;
    overflow-y:scroll;
    overflow-x:hidden;
  }

  #content table {
    text-align:left;
  }

  #content table td {
    vertical-align:top;
  }

  #sommaire, #quoi, #qui, #ensemble, #logos {
    table-layout: fixed;
    border-spacing:15px;
  }

  #sommaire {
    margin:7px;
    box-sizing:border-box;
    border-spacing:15px;
  }

  #sommaire td {
    padding: 0 10px;
    position:relative;
  }

  #content #sommaire td p {
    margin:0 0 50px 0;
  }

  #sommaire td a {
    display:block;
    position:absolute;
    bottom:0;
    right:15px;
    text-transform: uppercase;
    color:#FFFFFF;
    background-color:#480A2A;
    min-width:100px;
    text-align:center;
    text-decoration:none;
    font-family:"rubik";
    padding:7px 7px;
    font-weight:500;
    font-size:1.1em;
  }

  #content h2:nth-of-type(1) img {
      position:absolute;
      right:0;
      top:-75px;
  }

  #content h2:nth-of-type(2) img {
      position:absolute;
      left:0;
      top:-75px;
  }

  #quoi {
    margin:7px;
  }

  #quoi td {
    width: 30%;
  }

  #quoi td ul li {
    list-style-image: url('../assets/images/yellow.png');
  }

  #qui, #ensemble, #logos {
    max-width:800px;
    margin-left:auto;
    margin-right:auto;
  }

  #qui td {
    position:relative;
    padding-right:15px;
  }

  #content #qui td p {
    margin-bottom:50px;
  }

  #qui td a {
    position:absolute;
    bottom:0;
    right:15px;
    color:#480A2A;
    font-size:0.9em;
  }

  #logos td {
    text-align:center;
    width:50%;
  }

  #logos td img {
    padding:0 20px;
  }

  #partenaires {
    margin-top:-90px;
    background-color:#480A2A;
    text-align:center;
    padding:30px 0px;
  }

  #content #partenaires img {
    display:inline-block;
    margin:0 10px;
  }

  #enseignants-animateurs #wrapper {
    max-width:800px;
    margin-left:auto;
    margin-right:auto;
  }

  #enseignants-animateurs #content h3 { font-family:arial;font-size:18px;margin:20px 0 20px 0;text-transform: none;font-weight:600;}

  #enseignants-animateurs #content #sections h3,
  #enseignants-animateurs #content #outils h3
  {margin:20px 0 0 7px;text-transform: uppercase;}

  #sections p{
    padding-left: 7px;
    padding-right: 7px;
  }

  #sections {
    margin-top:30px;
    margin-bottom:40px;
  }

  #outils p{
    padding-left: 7px;
    padding-right: 7px;
  }

  #animateurs {
    display: block;
    position:absolute;
    width:144px;
    height:144px;
    background-image:url("../assets/images/animateurs.png");
    left:0;
    right:0;
    margin-left:auto;
    margin-right:auto;
    color:transparent;
  }

  #animateurs:hover {
    background-image:url("../assets/images//animateurs_on.png");
  }

  #content .page-text img#image_contact {
    margin-top:12px;
  }

  #enseignants-animateurs #content table a
  {text-decoration:none;color:#480a2a;}

  #enseignants-animateurs #content table a:hover,
  #enseignants-animateurs #content table a:active
  {text-decoration:none;color:#ba0000;}

#onLoadGif{
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#onLoadGif img{
  height: 50px
}
#onLoadGif p{
  font-weight: bolder;
}
#content{
    font-size: 13px;
    color: #480A2A;
    text-align: center;
}

#content h1 {
    font-size: 24pt;
    line-height: 40px;
    letter-spacing: -2px;
    margin: 30px 0 40px 0;
    text-align: left;
    text-transform: uppercase;
    font-family: "rubik";
    text-align: center;
    font-weight: 500;
}
#content .page-text {
    font-size: 16px;
    line-height: 22px;
}
#sommaire {
  text-align: left;
    margin: 7px;
    box-sizing: border-box;
    border-spacing: 15px;
}
#content table td {
    vertical-align: top;
}

#sommaire td {
    padding-right: 15px;
    position: relative;
}
#content h3 {
    font-family: arial;
    font-size: 18px;
    margin: 20px 0 7px 0;
    text-transform: uppercase;
    font-weight: 600;
}
#content #sommaire td p {
    margin: 0 0 50px 0;
}

/* Front page */
#content .front h1 {
  font-size:26px;
  letter-spacing: 0.5px;
  font-weight:bold;
}
.front__start {
  max-width:600px;
  margin:0 auto;
}
.front__menu {
  float:right;
  width:180px;
  text-align:center;
}
.front__menu a {
  display:block;
  width:120px;
  border:solid 2px #E32B1F;
  background-color:#FFFFFF;
  color:#E32B1F;
  text-transform: uppercase;
  margin:0 auto 30px;
  padding:6px 0;
  font-size:14px;
  text-decoration: none;
}

/* TO REMOVE WHEN FORUM READY*/
.front__menu a:last-child {
  display:none;
}

.front__menu a.selected {
  background-color:#E32B1F;
  color:#FFFFFF;
}

.front__portal {
  margin-right:180px;
  text-align:center;
  min-height:300px;
}

.front__portal a {
  display:block;
  text-transform: uppercase;
  font-size:18px;
  color:#470A29;
  font-weight:normal;
  cursor:pointer;
  text-decoration: none;
  letter-spacing:-1px;
}

.front__portal a img {
  display:block;
  width:210px;
  margin:0 auto 10px;
}

#content .front h2 {
  margin:40px auto 10px;
  background-color:transparent;
  color:#470A29;
}

.front__more__main {
  max-width:1000px;
  margin:0 auto;
}

.front__more {
  display:inline-block;
  width:50%;
  vertical-align:top;
}

.front__more__inner {
  margin:10px;
  border:solid 1px #CFD519;
  padding:15px 20px;
  box-sizing: border-box;
  text-align: left;
  position:relative;
  min-height:420px;
  font-size:16px;
}

.front__more__inner img {
  position:absolute;
  top:15px;
  left:50%;
  margin-left:-20px;
}

.front__more__inner img#cocorico {
  right:-20px;
  bottom:-20px;
  top:auto;
  left:auto;
}

#content .front__more__inner h3 {
  text-align: center;
  margin-top: 60px;
  margin-bottom: 25px;
}

.front__teachers {
  max-width:600px;
  font-size:16px;
  margin:0 auto;
}

.front__tools {
  max-width:1000px;
  margin:20px auto;
}

.front__tool {
  display:inline-block;
  vertical-align:top;
  width:25%;
  box-sizing: border-box;
  padding:0 10px;
  font-size:14px;
}

/* TO REMOVE WHEN FORUM READY*/
.front__tool:nth-child(3) {
  display:none;
}

.front__colombbus {
  margin-top:100px;
  background-color:#e32c1f;
  color:#ffffff;
}

.front__colombbus__inner {
  max-width:1000px;
  margin:0 auto;
  padding-bottom: 40px;
}

.front__colombbus__part {
  width:50%;
  display:inline-block;
  box-sizing: border-box;
  padding: 40px 100px;
  vertical-align:top;
  position:relative;
  min-height:300px;
}

#content .front__colombbus__part h3 {
  font-weight:normal;
  margin-bottom:25px;
}

.front__colombbus__part a {
  display:block;
  text-transform: uppercase;
  width:200px;
  border:solid 1px #ffffff;
  color:#ffffff;
  text-decoration:none;
  padding:5px 0;
  position:absolute;
  bottom:0;
  left:50%;
  margin-left:-100px;
}

.front__colombbus__part a:hover {
  background-color:#ffffff;
  color:#e32c1f;
}

.front__partners {
  background-color:#470a2b;
  color:#ffffff;
  padding:15px 0 30px;
}

.front__partners__inner {
  max-width:1000px;
  margin:0 auto;
}

.front__partners__part {
  display:inline-block;
  vertical-align:top;
  width:50%;
  box-sizing: border-box;
  padding:20px 0;
}

.front__partners__part:last-child {
  border-left:solid 1px #ffffff;
}

.front__partners__part img {
  margin:0 10px;
}

#content .front__partners__part h3 {
  font-weight:normal;
  margin-bottom:25px;
}

.front__warning {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  color: #ffffff;
  background-color:#480A2A;
}

.front__warning a:hover {
  color: #337ab7;
}


</style>
