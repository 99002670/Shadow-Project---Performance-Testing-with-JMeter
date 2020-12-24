/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 53.748742399720044, "KoPercent": 46.251257600279956};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5113184025195748, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Payroll-1502-0"], "isController": false}, {"data": [0.9979423868312757, 500, 1500, "Payroll-1502-1"], "isController": false}, {"data": [1.0, 500, 1500, "Payroll-1507"], "isController": false}, {"data": [0.953103448275862, 500, 1500, "Payroll-1506"], "isController": false}, {"data": [0.0, 500, 1500, "Home-1519"], "isController": false}, {"data": [0.9986168741355463, 500, 1500, "Payroll-1505"], "isController": false}, {"data": [0.0, 500, 1500, "Home-1518"], "isController": false}, {"data": [0.9423076923076923, 500, 1500, "Payroll-1504"], "isController": false}, {"data": [0.9979253112033195, 500, 1500, "Home-1517"], "isController": false}, {"data": [1.0, 500, 1500, "Payroll-1509"], "isController": false}, {"data": [0.9972527472527473, 500, 1500, "Payroll-1508"], "isController": false}, {"data": [0.789437585733882, 500, 1500, "Payroll-1503"], "isController": false}, {"data": [0.9979423868312757, 500, 1500, "Payroll-1502"], "isController": false}, {"data": [0.0, 500, 1500, "Payroll-1501"], "isController": false}, {"data": [0.9687933425797504, 500, 1500, "Employee Benefits-1531"], "isController": false}, {"data": [0.0, 500, 1500, "Employee Benefits-1530"], "isController": false}, {"data": [0.0, 500, 1500, "Employee Benefits-1532"], "isController": false}, {"data": [0.0, 500, 1500, "Home-1523"], "isController": false}, {"data": [0.0, 500, 1500, "Home-1522"], "isController": false}, {"data": [0.0, 500, 1500, "Home-1521"], "isController": false}, {"data": [0.0, 500, 1500, "TEMS-1533"], "isController": false}, {"data": [0.0, 500, 1500, "TEMS-1534"], "isController": false}, {"data": [0.0, 500, 1500, "Home-1527"], "isController": false}, {"data": [0.0, 500, 1500, "TEMS-1535"], "isController": false}, {"data": [0.0, 500, 1500, "Home-1526"], "isController": false}, {"data": [0.0, 500, 1500, "TEMS-1536"], "isController": false}, {"data": [0.0, 500, 1500, "Home-1525"], "isController": false}, {"data": [0.0, 500, 1500, "TEMS-1537"], "isController": false}, {"data": [0.0, 500, 1500, "Home-1524"], "isController": false}, {"data": [0.0, 500, 1500, "TEMS-1538"], "isController": false}, {"data": [0.0, 500, 1500, "i-TEMS-1549"], "isController": false}, {"data": [0.9985994397759104, 500, 1500, "TEMS-1543-0"], "isController": false}, {"data": [0.9971988795518207, 500, 1500, "TEMS-1543-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1499"], "isController": false}, {"data": [0.9985994397759104, 500, 1500, "TEMS-1542"], "isController": false}, {"data": [0.9986282578875172, 500, 1500, "Login-1498"], "isController": false}, {"data": [0.9957983193277311, 500, 1500, "TEMS-1543"], "isController": false}, {"data": [0.0, 500, 1500, "Login-1497"], "isController": false}, {"data": [0.9992997198879552, 500, 1500, "TEMS-1544"], "isController": false}, {"data": [0.0, 500, 1500, "Login-1496"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1495"], "isController": false}, {"data": [0.8406292749658003, 500, 1500, "Login-1494"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1493"], "isController": false}, {"data": [0.8726158038147139, 500, 1500, "Login-1492"], "isController": false}, {"data": [0.0, 500, 1500, "TEMS-1541"], "isController": false}, {"data": [0.0, 500, 1500, "TEMS-1539"], "isController": false}, {"data": [0.0, 500, 1500, "i-TEMS-1555"], "isController": false}, {"data": [0.0, 500, 1500, "i-TEMS-1553"], "isController": false}, {"data": [0.0, 500, 1500, "i-TEMS-1554"], "isController": false}, {"data": [0.0, 500, 1500, "i-TEMS-1551"], "isController": false}, {"data": [0.0, 500, 1500, "i-TEMS-1552"], "isController": false}, {"data": [0.0, 500, 1500, "i-TEMS-1550"], "isController": false}, {"data": [0.9972337482710927, 500, 1500, "Payroll-1516"], "isController": false}, {"data": [0.0, 500, 1500, "Login-1500"], "isController": false}, {"data": [0.9986206896551724, 500, 1500, "Payroll-1510"], "isController": false}, {"data": [0.9993150684931507, 500, 1500, "Login-1496-0"], "isController": false}, {"data": [0.9986168741355463, 500, 1500, "Payroll-1514"], "isController": false}, {"data": [0.9674965421853389, 500, 1500, "Payroll-1513"], "isController": false}, {"data": [1.0, 500, 1500, "Payroll-1512"], "isController": false}, {"data": [0.9993103448275862, 500, 1500, "Payroll-1511"], "isController": false}, {"data": [1.0, 500, 1500, "TEMS-1542-1"], "isController": false}, {"data": [0.0, 500, 1500, "Login-1496-1"], "isController": false}, {"data": [0.9985994397759104, 500, 1500, "TEMS-1542-2"], "isController": false}, {"data": [1.0, 500, 1500, "TEMS-1542-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 45722, 21147, 46.251257600279956, 145.06861029701295, 27, 25202, 49.0, 248.90000000000146, 414.9500000000007, 1820.9800000000032, 76.16931104106831, 414.59267985299897, 61.84506792695096], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Payroll-1502-0", 729, 0, 0.0, 42.27434842249656, 28, 196, 39.0, 54.0, 59.0, 108.7000000000005, 1.229891941592786, 0.43598708476384895, 1.0114790968982765], "isController": false}, {"data": ["Payroll-1502-1", 729, 0, 0.0, 74.64609053497941, 29, 23223, 40.0, 50.0, 55.0, 68.10000000000014, 1.2298732673801844, 2.3444459159434765, 0.8997662645045753], "isController": false}, {"data": ["Payroll-1507", 728, 0, 0.0, 49.79532967032967, 31, 221, 47.0, 63.10000000000002, 69.54999999999995, 88.13000000000011, 1.2281696223715821, 0.47255745235781577, 0.866136760188072], "isController": false}, {"data": ["Payroll-1506", 725, 0, 0.0, 258.26620689655175, 68, 3904, 151.0, 466.39999999999986, 749.0999999999971, 1685.3200000000033, 1.2227907965174918, 0.4740702599779729, 0.8707229070670562], "isController": false}, {"data": ["Home-1519", 723, 723, 100.0, 43.62655601659746, 31, 213, 42.0, 52.0, 57.0, 74.0, 1.2190022727732555, 2.1844425493544177, 0.8655065640448283], "isController": false}, {"data": ["Payroll-1505", 723, 0, 0.0, 46.9073305670816, 30, 1636, 42.0, 53.0, 59.799999999999955, 118.43999999999983, 1.2188193804081948, 1.0045737861958168, 0.8714530912580475], "isController": false}, {"data": ["Home-1518", 723, 723, 100.0, 51.49792531120333, 33, 1419, 46.0, 60.0, 72.79999999999995, 164.23999999999978, 1.2187495259013774, 2.4759059787629103, 1.0734136054294197], "isController": false}, {"data": ["Payroll-1504", 728, 0, 0.0, 300.91895604395654, 70, 24282, 149.5, 474.0, 804.4999999999995, 2230.1000000000004, 1.2278837558400377, 1.6919374799709896, 0.8635369493076287], "isController": false}, {"data": ["Home-1517", 723, 0, 0.0, 86.34301521438458, 43, 1916, 70.0, 143.60000000000002, 177.0, 220.51999999999998, 1.218698167401594, 0.5129481544434443, 1.0927315210465633], "isController": false}, {"data": ["Payroll-1509", 725, 0, 0.0, 41.35724137931028, 28, 209, 39.0, 52.0, 60.0, 85.44000000000005, 1.2229372422343485, 0.47054421234407545, 0.8612729906930259], "isController": false}, {"data": ["Payroll-1508", 728, 0, 0.0, 79.37225274725265, 28, 24105, 40.0, 61.0, 70.54999999999995, 102.26000000000022, 1.228171694353953, 0.4725582495854077, 0.8673376078235212], "isController": false}, {"data": ["Payroll-1503", 729, 0, 0.0, 504.1810699588475, 268, 1499, 468.0, 709.0, 782.0, 1005.5000000000011, 1.2291371255051855, 98.0632966234347, 0.9184329760925241], "isController": false}, {"data": ["Payroll-1502", 729, 0, 0.0, 117.04389574759941, 60, 23261, 81.0, 99.0, 110.0, 189.50000000000068, 1.229773681156291, 2.7802012420672004, 1.9110752459336495], "isController": false}, {"data": ["Payroll-1501", 729, 729, 100.0, 143.38957475994516, 54, 25202, 76.0, 89.0, 101.5, 153.70000000000005, 1.2298048001187631, 25.579501953833397, 1.0642506056240373], "isController": false}, {"data": ["Employee Benefits-1531", 721, 18, 2.496532593619972, 661.7364771151181, 240, 15044, 279.0, 310.0, 354.89999999999975, 15029.78, 1.2152798261863307, 36.41863956502758, 0.6532451690098587], "isController": false}, {"data": ["Employee Benefits-1530", 721, 721, 100.0, 47.89597780859914, 33, 1101, 45.0, 55.0, 59.89999999999998, 87.77999999999997, 1.2157039954676667, 2.178532062190594, 1.050731074283561], "isController": false}, {"data": ["Employee Benefits-1532", 721, 14, 1.941747572815534, 2428.542302357835, 1764, 15054, 1862.0, 3003.6000000000035, 4012.4999999999995, 15038.0, 1.2123148319405443, 50.24320384880534, 0.5477800850806248], "isController": false}, {"data": ["Home-1523", 723, 723, 100.0, 112.9502074688797, 32, 23525, 45.0, 56.0, 62.0, 106.75999999999999, 1.2190104939437265, 2.1844572816276737, 1.0187580798435012], "isController": false}, {"data": ["Home-1522", 722, 722, 100.0, 43.994459833794934, 30, 1376, 40.0, 51.0, 56.0, 78.76999999999998, 1.2173737101234234, 2.1815241778090644, 0.8227408981503338], "isController": false}, {"data": ["Home-1521", 723, 723, 100.0, 42.24066390041497, 30, 227, 40.0, 50.0, 54.0, 78.51999999999998, 1.2190474905831532, 2.1845235793164903, 0.8203005787735674], "isController": false}, {"data": ["TEMS-1533", 714, 714, 100.0, 43.39215686274508, 30, 1064, 40.0, 50.0, 53.0, 69.55000000000007, 1.2041690558909839, 2.157861540585894, 0.8102599704438896], "isController": false}, {"data": ["TEMS-1534", 715, 715, 100.0, 43.71888111888112, 30, 1032, 41.0, 50.0, 55.0, 73.88000000000022, 1.2058230290274488, 2.160825447524774, 0.8149088264980875], "isController": false}, {"data": ["Home-1527", 722, 722, 100.0, 48.40858725761772, 33, 1103, 45.0, 54.700000000000045, 60.0, 88.84999999999991, 1.2173757627567323, 2.181527856111918, 1.0272233705374834], "isController": false}, {"data": ["TEMS-1535", 716, 716, 100.0, 47.304469273743045, 33, 676, 44.0, 55.0, 62.0, 76.66000000000008, 1.2074646951488925, 2.163767300388885, 1.0093946624073744], "isController": false}, {"data": ["Home-1526", 722, 722, 100.0, 48.22991689750689, 32, 1037, 45.0, 55.0, 60.0, 95.76999999999998, 1.217363447060708, 2.1815057864808582, 1.0177023266057985], "isController": false}, {"data": ["TEMS-1536", 715, 715, 100.0, 75.88251748251744, 33, 20391, 44.0, 55.0, 59.0, 80.84000000000003, 1.205792526110046, 2.160770786535092, 1.0080034215416942], "isController": false}, {"data": ["Home-1525", 723, 723, 100.0, 75.55186721991704, 30, 22692, 41.0, 51.0, 56.0, 89.07999999999993, 1.2190454351553819, 2.184519896005982, 0.8357753584212771], "isController": false}, {"data": ["TEMS-1537", 716, 716, 100.0, 80.25698324022345, 30, 24422, 41.0, 52.0, 57.0, 132.5200000000018, 1.2074382241889, 2.1637198646353824, 0.8277851445047227], "isController": false}, {"data": ["Home-1524", 723, 723, 100.0, 45.08990318118948, 30, 1108, 41.0, 51.0, 55.0, 72.75999999999999, 1.2190248812588835, 2.184483063584034, 0.8354401899056985], "isController": false}, {"data": ["TEMS-1538", 716, 716, 100.0, 47.40642458100557, 30, 1410, 41.0, 50.0, 55.14999999999998, 96.96000000000049, 1.2074769129065115, 2.1637891945150867, 0.8278116683840047], "isController": false}, {"data": ["i-TEMS-1549", 646, 646, 100.0, 148.68421052631587, 31, 1746, 147.0, 171.0, 185.94999999999993, 303.1199999999999, 1.0894899635375033, 1.9584052474710678, 0.7254262882459886], "isController": false}, {"data": ["TEMS-1543-0", 714, 0, 0.0, 39.4635854341737, 28, 1035, 35.5, 42.0, 46.0, 71.70000000000005, 1.2043477967519718, 0.7538934938652481, 0.9223851663231296], "isController": false}, {"data": ["TEMS-1543-1", 714, 0, 0.0, 43.536414565826334, 29, 2062, 37.0, 44.0, 50.0, 72.25000000000011, 1.2043620170533613, 1.6136569212863394, 0.9200437877944487], "isController": false}, {"data": ["Login-1499", 729, 0, 0.0, 43.12482853223594, 29, 149, 41.0, 53.0, 57.5, 81.70000000000005, 1.229869117632173, 0.522454166181636, 0.8349068493292237], "isController": false}, {"data": ["TEMS-1542", 714, 0, 0.0, 120.43697478991592, 90, 1752, 114.0, 136.0, 150.25, 242.0500000000003, 1.2040878275827178, 3.128316801367668, 2.8918851868950046], "isController": false}, {"data": ["Login-1498", 729, 0, 0.0, 66.94650205761322, 29, 17248, 41.0, 53.0, 60.5, 98.30000000000041, 1.2299126913830192, 0.4756302986207769, 0.8253277368298958], "isController": false}, {"data": ["TEMS-1543", 714, 0, 0.0, 83.11484593837528, 58, 2097, 73.0, 85.0, 95.0, 206.90000000000123, 1.2042848251678662, 2.3674075713505025, 1.8423217565691712], "isController": false}, {"data": ["Login-1497", 730, 730, 100.0, 76.36438356164375, 54, 1135, 69.0, 81.0, 93.44999999999993, 204.0, 1.2315416370731147, 24.80745332847324, 0.834836032040327], "isController": false}, {"data": ["TEMS-1544", 714, 0, 0.0, 72.21988795518212, 54, 1091, 67.0, 84.0, 96.0, 155.40000000000055, 1.2043010752688172, 22.953070643580013, 0.9223493833017078], "isController": false}, {"data": ["Login-1496", 730, 730, 100.0, 141.34520547945186, 98, 1370, 129.0, 163.0, 191.79999999999973, 352.189999999997, 1.2314086809251423, 25.212058221592834, 1.8748803382831465], "isController": false}, {"data": ["Login-1495", 730, 0, 0.0, 82.12328767123284, 42, 353, 68.0, 133.89999999999998, 172.89999999999986, 219.68999999999994, 1.2311490837215109, 0.5181887256679405, 1.0616388017293428], "isController": false}, {"data": ["Login-1494", 731, 0, 0.0, 470.8467852257178, 220, 1940, 430.0, 688.6000000000001, 787.4, 1028.2799999999977, 1.2323762608254392, 0.4898214239804236, 1.0506620729672957], "isController": false}, {"data": ["Login-1493", 731, 0, 0.0, 45.02325581395347, 29, 287, 42.0, 55.0, 63.0, 102.0799999999997, 1.2332057952237314, 0.47569950108727926, 1.0454285058007908], "isController": false}, {"data": ["Login-1492", 734, 0, 0.0, 466.21117166212525, 235, 23153, 388.0, 635.5, 752.25, 992.6999999999996, 1.222787155070735, 0.768227821781271, 1.0478002117387566], "isController": false}, {"data": ["TEMS-1541", 714, 714, 100.0, 108.2927170868347, 34, 23395, 46.0, 56.0, 61.0, 83.70000000000005, 1.2041568709460897, 2.157839705259838, 1.044262725863738], "isController": false}, {"data": ["TEMS-1539", 714, 714, 100.0, 81.6974789915967, 33, 23186, 45.0, 56.0, 61.0, 77.70000000000005, 1.2041568709460897, 2.157839705259838, 1.016040299200939], "isController": false}, {"data": ["i-TEMS-1555", 646, 646, 100.0, 46.25232198142416, 32, 113, 45.0, 55.0, 60.0, 80.58999999999992, 1.089602059111755, 1.9525583774121784, 0.9179829485078693], "isController": false}, {"data": ["i-TEMS-1553", 646, 646, 100.0, 46.51238390092881, 32, 224, 45.0, 55.0, 61.0, 77.52999999999997, 1.0896314650482997, 1.9526110726207324, 0.9094949770055714], "isController": false}, {"data": ["i-TEMS-1554", 646, 646, 100.0, 44.6842105263158, 31, 1063, 41.0, 51.0, 56.0, 109.23999999999978, 1.0896388167804378, 1.9526242468672885, 0.7456296506788316], "isController": false}, {"data": ["i-TEMS-1551", 646, 646, 100.0, 42.08513931888545, 30, 181, 40.0, 50.0, 56.64999999999998, 78.70999999999981, 1.0896461686117807, 1.9526374212916189, 0.7446710546290565], "isController": false}, {"data": ["i-TEMS-1552", 646, 646, 100.0, 81.93034055727558, 33, 22380, 45.0, 55.0, 59.64999999999998, 98.95999999999913, 1.0896314650482997, 1.9526110726207324, 0.9085313631694445], "isController": false}, {"data": ["i-TEMS-1550", 646, 646, 100.0, 43.13003095975237, 30, 1125, 40.0, 50.0, 54.0, 67.52999999999997, 1.0896185997557637, 1.9525880181170174, 0.7349750097197014], "isController": false}, {"data": ["Payroll-1516", 723, 0, 0.0, 78.6058091286307, 30, 22944, 42.0, 53.0, 59.0, 118.75999999999976, 1.2187597981207836, 1.0045246773573646, 0.8714104900577521], "isController": false}, {"data": ["Login-1500", 729, 729, 100.0, 71.93004115226333, 49, 231, 69.0, 82.0, 92.0, 134.0, 1.2298566685561585, 24.545213865790416, 0.8288092158482806], "isController": false}, {"data": ["Payroll-1510", 725, 0, 0.0, 151.9475862068964, 64, 21865, 112.0, 175.0, 202.0, 285.6200000000001, 1.2227577995081984, 0.5671675748454266, 0.8635348141281652], "isController": false}, {"data": ["Login-1496-0", 730, 0, 0.0, 47.24109589041099, 29, 557, 41.0, 58.0, 75.0, 174.8299999999996, 1.23156241406478, 0.4149306961448722, 1.0415493624555667], "isController": false}, {"data": ["Payroll-1514", 723, 0, 0.0, 118.93637621023507, 57, 805, 107.0, 175.0, 195.79999999999995, 338.9999999999998, 1.2192222272812356, 0.4691148022937567, 0.8860288863340872], "isController": false}, {"data": ["Payroll-1513", 723, 0, 0.0, 313.0414937759337, 141, 1467, 278.0, 459.6, 535.7999999999997, 717.28, 1.2184085864943706, 4.5012106276447295, 0.8628304095950939], "isController": false}, {"data": ["Payroll-1512", 724, 0, 0.0, 48.309392265193395, 31, 166, 46.0, 63.0, 71.0, 93.25, 1.2210835936287772, 0.4698309920798224, 0.8635287291960412], "isController": false}, {"data": ["Payroll-1511", 725, 0, 0.0, 42.344827586206854, 29, 1084, 39.0, 50.0, 55.0, 74.48000000000002, 1.222858858473906, 1.5070780072207706, 0.8648003819958068], "isController": false}, {"data": ["TEMS-1542-1", 714, 0, 0.0, 36.687675070028035, 27, 108, 36.0, 43.0, 47.0, 63.700000000000045, 1.2042543574105495, 0.7538350030275022, 0.9210288647878724], "isController": false}, {"data": ["Login-1496-1", 730, 730, 100.0, 93.97534246575356, 65, 1324, 86.0, 104.0, 115.0, 176.0, 1.231514628031972, 24.799312803239392, 0.8335326988221322], "isController": false}, {"data": ["TEMS-1542-2", 714, 0, 0.0, 41.137254901960816, 29, 1687, 37.0, 46.0, 52.0, 78.40000000000009, 1.204266544328478, 1.613529002752609, 0.9199708536714949], "isController": false}, {"data": ["TEMS-1542-0", 714, 0, 0.0, 42.35994397759101, 30, 321, 39.0, 50.0, 55.0, 109.80000000000018, 1.2042238911948298, 0.7613825194421441, 1.0512681403089492], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 21115, 99.84867829952239, 46.18126941078693], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException\/Non HTTP response message: java.net.SocketException: Connection reset", 32, 0.15132170047760912, 0.06998818949302306], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 45722, 21147, "500\/Internal Server Error", 21115, "Non HTTP response code: javax.net.ssl.SSLException\/Non HTTP response message: java.net.SocketException: Connection reset", 32, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-1519", 723, 723, "500\/Internal Server Error", 723, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-1518", 723, 723, "500\/Internal Server Error", 723, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Payroll-1501", 729, 729, "500\/Internal Server Error", 729, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Employee Benefits-1531", 721, 18, "Non HTTP response code: javax.net.ssl.SSLException\/Non HTTP response message: java.net.SocketException: Connection reset", 18, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Employee Benefits-1530", 721, 721, "500\/Internal Server Error", 721, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Employee Benefits-1532", 721, 14, "Non HTTP response code: javax.net.ssl.SSLException\/Non HTTP response message: java.net.SocketException: Connection reset", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Home-1523", 723, 723, "500\/Internal Server Error", 723, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Home-1522", 722, 722, "500\/Internal Server Error", 722, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Home-1521", 723, 723, "500\/Internal Server Error", 723, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["TEMS-1533", 714, 714, "500\/Internal Server Error", 714, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["TEMS-1534", 715, 715, "500\/Internal Server Error", 715, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Home-1527", 722, 722, "500\/Internal Server Error", 722, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["TEMS-1535", 716, 716, "500\/Internal Server Error", 716, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Home-1526", 722, 722, "500\/Internal Server Error", 722, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["TEMS-1536", 715, 715, "500\/Internal Server Error", 715, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Home-1525", 723, 723, "500\/Internal Server Error", 723, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["TEMS-1537", 716, 716, "500\/Internal Server Error", 716, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Home-1524", 723, 723, "500\/Internal Server Error", 723, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["TEMS-1538", 716, 716, "500\/Internal Server Error", 716, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["i-TEMS-1549", 646, 646, "500\/Internal Server Error", 646, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-1497", 730, 730, "500\/Internal Server Error", 730, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-1496", 730, 730, "500\/Internal Server Error", 730, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["TEMS-1541", 714, 714, "500\/Internal Server Error", 714, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["TEMS-1539", 714, 714, "500\/Internal Server Error", 714, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["i-TEMS-1555", 646, 646, "500\/Internal Server Error", 646, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["i-TEMS-1553", 646, 646, "500\/Internal Server Error", 646, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["i-TEMS-1554", 646, 646, "500\/Internal Server Error", 646, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["i-TEMS-1551", 646, 646, "500\/Internal Server Error", 646, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["i-TEMS-1552", 646, 646, "500\/Internal Server Error", 646, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["i-TEMS-1550", 646, 646, "500\/Internal Server Error", 646, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-1500", 729, 729, "500\/Internal Server Error", 729, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-1496-1", 730, 730, "500\/Internal Server Error", 730, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
