<template>
  <div class="timeseries container-fluid">
    <h2>Time Series Charts</h2>
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
        <h3>Number of Students: <b>{{ charts.time_series.number_students }}</b></h3>
    </div>
    <br><br>


    <div class="row justify-content- center" >
        <div class="col-sm-6">
            <h3>Internship Conversion Time Series</h3><br>
            <line-chart class="col img-fluid" :data="charts.time_series.conversion_time_series" title='Internship Conversion Rate Time Series' width='600px' height="500px" xtitle="Year" ytitle="Conversion Rate"></line-chart>
            <br><br><br><br>
        </div>

        <div class="col-sm-6">
            <h3>Employment Rate Time Series</h3><br>
            <line-chart class="col img-fluid" :data="charts.time_series.employment_time_series" width='600px' height="500px" xtitle="Year" ytitle="Employment Rate"></line-chart>
        </div>
        
        <div class="container"> 
            <button type="button" class="btn btn-primary" @click="displayMean()">Mean </button>
            <button type="button" class="btn btn-primary" @click="displayMedian()"> Median </button> 
            <button type="button" class="btn btn-primary" @click="displayStddev()"> Standard Deviation </button> 
        </div>


        <div class="col-sm-6" v-if="mean">
            <h3>Salary Time Series (Mean)</h3><br>
            <line-chart class ="col img-fluid" title='Salary Time Series' width="600px" height="500px" :data="charts.time_series.salary_time_series.mean"></line-chart>
        <br><br><br><br>
        </div>

        <div class="col-sm-6" v-if="mean">
            <h3>Search Months Time Series (Mean)</h3><br>
            <line-chart class="col img-fluid" title='Search Months Time Series' width="600px" height="500px" :data="charts.time_series.search_months_time_series.mean"></line-chart>
        </div>

        <div class="col-sm-6" v-if="median">
            <h3>Salary Time Series (Median)</h3><br>
            <line-chart class ="col img-fluid" title='Salary Time Series' width="600px" height="500px" :data="charts.time_series.salary_time_series.median"></line-chart>
        <br><br><br><br>
        </div>

        <div class="col-sm-6" v-if="median">
            <h3>Search Months Time Series (Median)</h3><br>
            <line-chart class="col img-fluid" title='Search Months Time Series' width="600px" height="500px" :data="charts.time_series.search_months_time_series.median"></line-chart>
        </div>

        <div class="col-sm-6" v-if="stddev">
            <h3>Salary Time Series (Standard Deviation)</h3><br>
            <line-chart class ="col img-fluid" title='Salary Time Series' width="600px" height="500px" :data="charts.time_series.salary_time_series.std"></line-chart>
        <br><br><br><br>
        </div>

        <div class="col-sm-6" v-if="stddev">
            <h3>Search Months Time Series (Standard Deviation)</h3><br>
            <line-chart class="col img-fluid" title='Search Months Time Series' width="600px" height="500px" :data="charts.time_series.search_months_time_series.std"></line-chart>
        </div>

    </div>
  </div>
</template>

<script>
const db = firebase.initializeApp({
  databaseURL: 'https://seniors-webapp.firebaseio.com' 
}).database()

const firebaseNodeURL = 'https://seniors-webapp.firebaseio.com/chart_data/time_series.json'
const api1 = "https://4uorvmvtxd.execute-api.ap-southeast-1.amazonaws.com/default/filter_chart_data?firebase_node_url=" + firebaseNodeURL + "&filter_value="
const api2 = "&filter_type="
const resetURL = 'https://63bxgdg2lf.execute-api.ap-southeast-1.amazonaws.com/default/reset_timeseries_data'

export default {
  name: "timeseries",
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
    },
    displayMean() {
        this.mean = true;
        this.median = false;
        this.stddev = false;
    },
    displayMedian() {
        this.mean = false;
        this.median = true;
        this.stddev = false;
    },
    displayStddev() {
        this.mean = false;
        this.median = false;
        this.stddev = true;
    },
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
    displayMean();
  }, 
  data() {
      return {
          mean: true,
          median: false,
          stddev: false
      };
  } 
};

</script>
