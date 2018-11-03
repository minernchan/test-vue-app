<template>

<div id="career" class="container-fluid">
  <h2 class="header"> <strong> Graduate Statistics </strong> </h2>
  <div class="form-check header">
    <form id="filterForm2">
      <select class="custom-select" id="FilterTypeSelect">
        <option selected>Choose filter type...</option>
        <option value="Major">Major</option>
        <option value="Faculty">Faculty</option>
        <option value="Honours Class">Honours Class</option>
        <option value="Job Relevance">Job Relevance</option>
        <option value="Industry">Industry</option>
        <option value="Organisation Type">Organisation Type</option>
        <option value="NOC">NOC</option>
        <option value="Local Only Position">Local Only Position</option>
      </select>
      <input class="form-control" name="value" type="text" id="FilterValueInput" placeholder="Enter filter value here..."/>
      <button type="button" class="btn btn-primary" @click="callChartFunction()">Submit </button>
      <button type="button" class="btn btn-success" @click="resetChartFunction()"> Reset </button>
    </form>
    <br>
    <b>Latest Filter Results: </b>
    <p id="filterResults"></p>

    <b><u><h3> Filters Applied </h3></u></b>
    <table id="filterTable" class="table table-hover">
      <thead>
        <tr id="filterTypeTable">
        </tr>
      </thead>
      <tbody>
        <tr id="filterValueTable">
        </tr>
      </tbody>
    </table>
  </div>
<br><br>


  <div class="col-sm-6">
    <h4>Number of Students: <b>{{ charts.ges.number_students }}</b></h4>
  </div>

  <div class="col-sm-6">
    <h4>Internship Full-Time Conversion Percentage: <b>{{ Math.round(charts.ges.percentage_conversion*100)/100 +'%' }}</b></h4><br>
    <br><br>
  </div>

  <div class="row justify-content-  center" >
    <div class="col-sm-6">
      <h3>Graduates' Salary against CAP</h3><br>
      <scatter-chart class="col img-fluid" :data="charts.ges.pay_cap_scatter" title='Salary by CAP Scatter Plot' width='600px' height="500px" xtitle="CAP" ytitle="Monthly Pay"></scatter-chart>
      <br><br><br><br>
    </div>

    <div class="col-sm-6">
      <h3>Job Hunt Channel Utilization</h3><br>
      <bar-chart class="col img-fluid" :data="charts.ges.percentage_channels" :stacked="true" width='600px' height="500px" xtitle="Percentage of Students who Find the Channel Useful" ytitle="Job Channels"></bar-chart>
    </div>

    <div class="col-sm-6">
      <h3>Graudate Employment Status</h3><br>
      <pie-chart :donut="true" class ="row img-fluid" title='Employment Status Donut Chart' width="600px" height="500px" :data="charts.ges.percentage_employment"></pie-chart>
      <br><br><br><br>
    </div>

    <div class="col-sm-6">
      <h3>Job Hunt Duration Before First Offer</h3><br>
      <column-chart class ="row img-fluid" title='Job Hunt Duration (Months)' width="600px" height="500px" :data="charts.ges.percentage_months" xtitle="Month" ytitle="Number of Students"></column-chart>
    </div>

    <div class="col-sm-6">
      <h3>Course Relevance Rating</h3><br>
      <column-chart class="row img-fluid" title="Relevance of Course in Finding Related Employment" width="600px" height="500px" :data="charts.ges.percentage_relevance" xtitle="Extent of Relevance" ytitle="Number of Students"></column-chart>
      <br><br>
    </div>

    <div class="col-sm-6">
      <div class="container">
        <h2>Gross Salary Statistics ($/Month)</h2>
        <table class="table table-hover">
          <thead>
            <tr>
              <th>25th Percentile</th>
              <th>Median</th>
              <th>75th Percentile</th>
              <th>Minimum</th>
              <th>Maximum</th>
              <th>Outliers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ charts.ges.payrange_boxplot.lowerQuartile }}</td>
              <td>{{ charts.ges.payrange_boxplot.median }}</td>
              <td>{{ charts.ges.payrange_boxplot.upperQuartile }}</td>
              <td>{{ charts.ges.payrange_boxplot.minimum }}</td>
              <td>{{ charts.ges.payrange_boxplot.maximum }}</td>
              <ul class="list-group">
                <td v-for= "item in charts.ges.payrange_boxplot.outliers"><li class="list-group-item">{{ item }}</li> </td>
              </ul>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

</template>

<script>

import Vue from 'vue'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'
import firebase from 'firebase'

Vue.use(VueChartkick, {adapter: Chart})

const db = firebase.initializeApp({
  databaseURL: 'https://seniors-webapp.firebaseio.com' // chart_data, ges.json
}).database()

const firebaseNodeURL = 'https://seniors-webapp.firebaseio.com/chart_data/ges.json'
const api1 = "https://4uorvmvtxd.execute-api.ap-southeast-1.amazonaws.com/default/filter_chart_data?firebase_node_url=" + firebaseNodeURL + "&filter_value="
const api2 = "&filter_type="
const resetURL = 'https://kea57kzszf.execute-api.ap-southeast-1.amazonaws.com/default/reset_chart_data'

export default {
  name: "career",
  components: {

  },
  firebase: {
    charts:{
      source: db.ref('chart_data'),
      asObject: true,
    }
  },
  methods: {
    callChartFunction() {
      var x = document.getElementById("filterForm2");
      var newType = x.elements[0].value;
      var newVal = x.elements[1].value;
      var nodeURL = api1 + newVal + api2 + newType;
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
          document.getElementById("filterResults").innerHTML = "Successfully filtered by " + newType + ": " + newVal;
          var typeNode = document.createElement("TH");
          var typeTextNode = document.createTextNode(newType);
          typeNode.appendChild(typeTextNode);
          document.getElementById("filterTypeTable").appendChild(typeNode);
          var valNode = document.createElement("TD");
          var valTextNode = document.createTextNode(newVal);
          valNode.appendChild(valTextNode);
          document.getElementById("filterValueTable").appendChild(valNode);
          document.getElementById("filterForm2").reset();

        } else if (this.readyState != 4) {
          document.getElementById("filterResults").innerHTML = "Filtering..."
        } else if (this.status != 200 && this.readyState == 4) {
          document.getElementById("filterResults").innerHTML = "Invalid filter!";
        }
      };
      xhttp.open("GET", nodeURL, true);
      xhttp.send();
    },
    resetChartFunction() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
          document.getElementById("filterResults").innerHTML = "Successfully reset!";
          document.getElementById("filterTypeTable").innerHTML = "";
          document.getElementById("filterValueTable").innerHTML = "";
        } else if (this.readyState != 4) {
          document.getElementById("filterResults").innerHTML = "Resetting...";
        } else if (this.status != 200 && this.readyState == 4) {
           document.getElementById("filterResults").innerHTML = "Reset failed!";
        }
      };
      xhttp.open("GET", resetURL, true);
      xhttp.send();
    }
  },
  mounted() {
    var xhttp = new XMLHttpRequest();
    var filtertype = "Major";
    var filtervalue = "Bachelor of Engineering (Mechanical Engineering)";
    var nodeURL = api1 + filtervalue + api2 + filtertype;
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        document.getElementById("filterResults").innerHTML = "Successfully filtered by " + filtertype + ": " + filtervalue;
        var typeNode = document.createElement("TH");
        var typeTextNode = document.createTextNode(filtertype);
        typeNode.appendChild(typeTextNode);
        document.getElementById("filterTypeTable").appendChild(typeNode);
        var valNode = document.createElement("TD");
        var valTextNode = document.createTextNode(filtervalue);
        valNode.appendChild(valTextNode);
        document.getElementById("filterValueTable").appendChild(valNode);
      } else if (this.status == 502) {
        document.getElementById("filterResults").innerHTML = "Invalid filter!"
      }
    };
    xhttp.open("GET", nodeURL, true);
    xhttp.send();
  },
  data() {
  },
};
</script>
