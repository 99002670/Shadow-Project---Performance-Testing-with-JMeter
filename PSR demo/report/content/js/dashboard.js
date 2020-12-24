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

    var data = {"OkPercent": 99.99521714176392, "KoPercent": 0.004782858236081882};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9814425100440023, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9976325757575758, 500, 1500, "Launch-Get home"], "isController": false}, {"data": [0.9870067372473532, 500, 1500, "Place order-Post check"], "isController": false}, {"data": [0.9995192307692308, 500, 1500, "Place order-Get index"], "isController": false}, {"data": [0.9831730769230769, 500, 1500, "Place order-Post delete cart"], "isController": false}, {"data": [0.9824144486692015, 500, 1500, "Login-Post check"], "isController": false}, {"data": [0.9851816443594646, 500, 1500, "Select MacBook Pro-Post view"], "isController": false}, {"data": [0.9502369668246445, 500, 1500, "Login-Options login"], "isController": false}, {"data": [0.9871306005719733, 500, 1500, "Select MacBook Pro-Post check"], "isController": false}, {"data": [0.9823809523809524, 500, 1500, "Browse laptops-Post bycat"], "isController": false}, {"data": [0.9726224783861671, 500, 1500, "Cart-Post check"], "isController": false}, {"data": [0.9697406340057637, 500, 1500, "Cart-Post view"], "isController": false}, {"data": [0.9837164750957854, 500, 1500, "Add to cart-Options add to cart"], "isController": false}, {"data": [0.946685878962536, 500, 1500, "Cart-Post view cart"], "isController": false}, {"data": [0.9506704980842912, 500, 1500, "Add to cart-Post add to cart"], "isController": false}, {"data": [0.9990467111534795, 500, 1500, "Select MacBook Pro-Get prod"], "isController": false}, {"data": [0.99, 500, 1500, "Browse laptops-Options bycat"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.9743346007604563, 500, 1500, "Login-Post user credential"], "isController": false}, {"data": [1.0, 500, 1500, "Cart-Get cart"], "isController": false}, {"data": [0.9875, 500, 1500, "Place order-Options delete cart"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20908, 1, 0.004782858236081882, 298.37803711498066, 56, 4269, 297.0, 434.0, 484.0, 577.0, 34.83830547335307, 59.07204015827868, 13.614112170370777], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Launch-Get home", 1056, 0, 0.0, 287.88068181818204, 179, 1347, 210.0, 419.0, 425.15, 446.72000000000025, 1.7608598865779457, 8.461508338655376, 0.5812213297493609], "isController": false}, {"data": ["Place order-Post check", 1039, 0, 0.0, 321.40808469682395, 261, 667, 299.0, 401.0, 454.0, 550.1999999999998, 1.7507350896851541, 0.9580388059952988, 0.6924294055883666], "isController": false}, {"data": ["Place order-Get index", 1040, 0, 0.0, 155.93269230769232, 57, 1265, 71.0, 280.0, 285.0, 301.0, 1.7524880274736199, 8.421401385897864, 0.6674514948385857], "isController": false}, {"data": ["Place order-Post delete cart", 1040, 0, 0.0, 345.23461538461515, 267, 643, 322.0, 445.0, 485.94999999999993, 565.7699999999998, 1.7522400029653293, 0.6793418169549439, 0.6776240636467484], "isController": false}, {"data": ["Login-Post check", 1052, 0, 0.0, 325.33174904942985, 265, 639, 298.0, 425.70000000000005, 468.3499999999999, 560.3500000000001, 1.7725089257281692, 0.9698360855732601, 0.683731470373659], "isController": false}, {"data": ["Select MacBook Pro-Post view", 1046, 0, 0.0, 334.9407265774376, 261, 690, 303.0, 442.30000000000007, 479.65, 572.1199999999999, 1.7623965897794478, 1.2001084517320686, 0.6712252636855318], "isController": false}, {"data": ["Login-Options login", 1055, 0, 0.0, 414.49099526066345, 359, 978, 389.0, 500.19999999999993, 565.0, 653.9600000000005, 1.759113206855039, 0.8744420312797007, 0.6819999444545415], "isController": false}, {"data": ["Select MacBook Pro-Post check", 1049, 0, 0.0, 329.04194470924665, 267, 644, 302.0, 425.0, 471.0, 549.5, 1.7674899788878462, 0.9671654037425632, 0.7111385461931569], "isController": false}, {"data": ["Browse laptops-Post bycat", 1050, 0, 0.0, 337.52666666666664, 274, 1234, 309.5, 428.9, 478.89999999999986, 563.9200000000001, 1.7691540410848114, 2.497042787938245, 0.6582496969270637], "isController": false}, {"data": ["Cart-Post check", 1041, 0, 0.0, 349.9923150816526, 267, 1231, 312.0, 469.80000000000007, 505.0, 575.7399999999998, 1.7539839529844687, 0.9596312000215668, 0.6920014814509037], "isController": false}, {"data": ["Cart-Post view", 1041, 0, 0.0, 348.05955811719485, 264, 987, 308.0, 470.80000000000007, 512.6999999999999, 617.5799999999999, 1.7540578384143721, 1.194417778854757, 0.6492069538662569], "isController": false}, {"data": ["Add to cart-Options add to cart", 1044, 0, 0.0, 313.75095785440664, 248, 747, 270.0, 436.0, 480.0, 574.2999999999997, 1.7590771921488544, 0.8744179585942883, 0.7180608069513877], "isController": false}, {"data": ["Cart-Post view cart", 1041, 0, 0.0, 379.1200768491836, 279, 770, 345.0, 504.80000000000007, 558.0, 669.6999999999989, 1.7538598394738083, 0.8875437280346324, 0.7193565747841792], "isController": false}, {"data": ["Add to cart-Post add to cart", 1044, 0, 0.0, 377.89942528735634, 280, 4269, 343.0, 499.0, 542.75, 626.55, 1.758860851194307, 0.6304058857818675, 0.8364894868472924], "isController": false}, {"data": ["Select MacBook Pro-Get prod", 1049, 0, 0.0, 154.5815061963775, 57, 1005, 68.0, 277.0, 284.5, 307.0, 1.7675882614615208, 9.269051927012422, 0.6697502396944043], "isController": false}, {"data": ["Browse laptops-Options bycat", 1050, 0, 0.0, 297.8799999999999, 242, 587, 266.0, 399.0, 444.0, 533.47, 1.7692345280440522, 0.8794602876354096, 0.6859239332358289], "isController": false}, {"data": ["Logout", 1037, 0, 0.0, 72.19672131147541, 56, 303, 64.0, 72.0, 77.0, 278.0, 1.7480484059383077, 8.400465910948988, 0.6674677018768342], "isController": false}, {"data": ["Login-Post user credential", 1052, 1, 0.09505703422053231, 350.99524714828897, 267, 636, 327.0, 448.0, 500.6999999999998, 576.8800000000001, 1.7723984324719566, 0.8883200106857766, 0.7061900004380451], "isController": false}, {"data": ["Cart-Get cart", 1042, 0, 0.0, 155.8109404990405, 56, 330, 71.5, 280.0, 287.0, 303.0, 1.755683646699837, 9.756996381429854, 0.680670320058433], "isController": false}, {"data": ["Place order-Options delete cart", 1040, 0, 0.0, 312.5548076923078, 240, 717, 271.0, 430.9, 466.89999999999986, 550.5899999999999, 1.7524644030668128, 0.8711177752969921, 0.7033817086527929], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502\/Bad Gateway", 1, 100.0, 0.004782858236081882], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20908, 1, "502\/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-Post user credential", 1052, 1, "502\/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
