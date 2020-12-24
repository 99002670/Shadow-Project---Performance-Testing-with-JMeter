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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9821488858879136, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.998641304347826, 500, 1500, "Buy phone-660"], "isController": false}, {"data": [0.9931506849315068, 500, 1500, "Laptop-672"], "isController": false}, {"data": [0.9945504087193461, 500, 1500, "Laptop-671"], "isController": false}, {"data": [0.9933774834437086, 500, 1500, "Buy monitor-736"], "isController": false}, {"data": [0.9891891891891892, 500, 1500, "Buy phone-624"], "isController": false}, {"data": [0.9867549668874173, 500, 1500, "Buy monitor-738"], "isController": false}, {"data": [0.9503311258278145, 500, 1500, "Buy monitor-737"], "isController": false}, {"data": [0.9836956521739131, 500, 1500, "Buy phone-663"], "isController": false}, {"data": [0.9932065217391305, 500, 1500, "Buy phone-661"], "isController": false}, {"data": [0.9864130434782609, 500, 1500, "Buy phone-662"], "isController": false}, {"data": [0.9897959183673469, 500, 1500, "Logout-840"], "isController": false}, {"data": [0.9900662251655629, 500, 1500, "Buy monitor-739"], "isController": false}, {"data": [0.9920212765957447, 500, 1500, "Signup-581"], "isController": false}, {"data": [0.9903314917127072, 500, 1500, "Buy laptop-712"], "isController": false}, {"data": [1.0, 500, 1500, "Place order-812"], "isController": false}, {"data": [0.9958677685950413, 500, 1500, "Buy laptop-711"], "isController": false}, {"data": [1.0, 500, 1500, "Buy laptop-710"], "isController": false}, {"data": [0.9829931972789115, 500, 1500, "Place order-814"], "isController": false}, {"data": [0.9965986394557823, 500, 1500, "Place order-813"], "isController": false}, {"data": [0.9931506849315068, 500, 1500, "Buy laptop-675"], "isController": false}, {"data": [0.9897959183673469, 500, 1500, "Place order-815"], "isController": false}, {"data": [0.9900662251655629, 500, 1500, "Buy monitor-761"], "isController": false}, {"data": [0.9867549668874173, 500, 1500, "Buy monitor-760"], "isController": false}, {"data": [0.9900662251655629, 500, 1500, "Buy monitor-762"], "isController": false}, {"data": [0.9944598337950139, 500, 1500, "Buy laptop-713"], "isController": false}, {"data": [0.9768211920529801, 500, 1500, "Buy monitor-724"], "isController": false}, {"data": [0.9892183288409704, 500, 1500, "Login-614"], "isController": false}, {"data": [0.9878706199460916, 500, 1500, "Login-613"], "isController": false}, {"data": [0.929144385026738, 500, 1500, "Login-610"], "isController": false}, {"data": [0.9893333333333333, 500, 1500, "Signup-591"], "isController": false}, {"data": [0.9932975871313673, 500, 1500, "Login-612"], "isController": false}, {"data": [0.9986595174262735, 500, 1500, "Login-611"], "isController": false}, {"data": [0.9454787234042553, 500, 1500, "Signup-590"], "isController": false}, {"data": [0.9904109589041096, 500, 1500, "Buy laptop-689"], "isController": false}, {"data": [0.9972527472527473, 500, 1500, "Buy laptop-688"], "isController": false}, {"data": [1.0, 500, 1500, "Buy laptop-687"], "isController": false}, {"data": [0.9966442953020134, 500, 1500, "Cart-789"], "isController": false}, {"data": [0.9865771812080537, 500, 1500, "Cart-788"], "isController": false}, {"data": [0.9899328859060402, 500, 1500, "Cart-787"], "isController": false}, {"data": [0.9966442953020134, 500, 1500, "Cart-786"], "isController": false}, {"data": [0.9918478260869565, 500, 1500, "Buy phone-645"], "isController": false}, {"data": [0.9966887417218543, 500, 1500, "Cart-781"], "isController": false}, {"data": [0.9867549668874173, 500, 1500, "Cart-780"], "isController": false}, {"data": [0.9748010610079576, 500, 1500, "Signup-563-1"], "isController": false}, {"data": [0.9959349593495935, 500, 1500, "Buy phone-643"], "isController": false}, {"data": [0.9986737400530504, 500, 1500, "Signup-563-0"], "isController": false}, {"data": [0.9905149051490515, 500, 1500, "Buy phone-644"], "isController": false}, {"data": [0.9966887417218543, 500, 1500, "Buy monitor-759"], "isController": false}, {"data": [0.983739837398374, 500, 1500, "Buy phone-641"], "isController": false}, {"data": [0.9899328859060402, 500, 1500, "Cart-785"], "isController": false}, {"data": [0.9932885906040269, 500, 1500, "Cart-784"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "Cart-783"], "isController": false}, {"data": [0.989159891598916, 500, 1500, "Buy phone-640"], "isController": false}, {"data": [0.9933774834437086, 500, 1500, "Cart-782"], "isController": false}, {"data": [0.9986702127659575, 500, 1500, "Signup-564"], "isController": false}, {"data": [0.9931129476584022, 500, 1500, "Buy laptop-693"], "isController": false}, {"data": [0.9986737400530504, 500, 1500, "Signup-562"], "isController": false}, {"data": [0.9944903581267218, 500, 1500, "Buy laptop-691"], "isController": false}, {"data": [0.713527851458886, 500, 1500, "Signup-563"], "isController": false}, {"data": [0.9917355371900827, 500, 1500, "Buy laptop-690"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-823"], "isController": false}, {"data": [0.9920424403183024, 500, 1500, "Signup-560"], "isController": false}, {"data": [0.9932432432432432, 500, 1500, "Buy phone-638"], "isController": false}, {"data": [1.0, 500, 1500, "Signup-561"], "isController": false}, {"data": [0.9905405405405405, 500, 1500, "Buy phone-639"], "isController": false}, {"data": [1.0, 500, 1500, "Buy phone-637"], "isController": false}, {"data": [0.9931129476584022, 500, 1500, "Buy laptop-695"], "isController": false}, {"data": [0.9930747922437673, 500, 1500, "Monitor-721"], "isController": false}, {"data": [0.9889807162534435, 500, 1500, "Buy laptop-694"], "isController": false}, {"data": [0.9930747922437673, 500, 1500, "Monitor-720"], "isController": false}, {"data": [0.49328859060402686, 500, 1500, "Place order-793"], "isController": false}, {"data": [0.8648648648648649, 500, 1500, "Place order-795"], "isController": false}, {"data": [0.9933774834437086, 500, 1500, "Buy monitor-740"], "isController": false}, {"data": [1.0, 500, 1500, "Place order-794"], "isController": false}, {"data": [1.0, 500, 1500, "Place order-796"], "isController": false}, {"data": [1.0, 500, 1500, "Login-594"], "isController": false}, {"data": [0.9867549668874173, 500, 1500, "Buy monitor-743"], "isController": false}, {"data": [1.0, 500, 1500, "Buy monitor-742"], "isController": false}, {"data": [0.9852941176470589, 500, 1500, "Login-593"], "isController": false}, {"data": [0.9834437086092715, 500, 1500, "Cart-772"], "isController": false}, {"data": [0.9919786096256684, 500, 1500, "Login-592"], "isController": false}, {"data": [0.9933774834437086, 500, 1500, "Buy monitor-744"], "isController": false}, {"data": [0.9919137466307277, 500, 1500, "Phone-623"], "isController": false}, {"data": [0.9932614555256065, 500, 1500, "Phone-622"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-839"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23696, 0, 0.0, 275.3540681971658, 47, 3524, 288.0, 417.0, 470.0, 885.9600000000064, 39.48958182306014, 1411.10498962234, 15.262394473566678], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Buy phone-660", 368, 0, 0.0, 67.88858695652179, 47, 501, 51.0, 71.10000000000002, 257.0, 281.34000000000003, 0.6244675904714391, 0.29395873211019136, 0.22441804032567342], "isController": false}, {"data": ["Laptop-672", 365, 0, 0.0, 337.0547945205483, 270, 1316, 313.0, 418.2000000000001, 445.4, 557.1599999999994, 0.6192664830923283, 0.8740693904000122, 0.2364581981338871], "isController": false}, {"data": ["Laptop-671", 367, 0, 0.0, 302.0599455040873, 248, 844, 274.0, 380.59999999999997, 421.59999999999997, 528.0399999999998, 0.6227167758541994, 0.3095472784349957, 0.24750559352798748], "isController": false}, {"data": ["Buy monitor-736", 151, 0, 0.0, 130.08609271523176, 47, 1337, 53.0, 267.0, 294.4, 1323.9999999999998, 0.2661182164087435, 0.12513187501431927, 0.09745540151687383], "isController": false}, {"data": ["Buy phone-624", 370, 0, 0.0, 178.94594594594594, 52, 2406, 78.5, 287.0, 310.34999999999997, 1146.1500000000049, 0.6278177563829552, 3.2913670657410035, 0.23727096847676143], "isController": false}, {"data": ["Buy monitor-738", 151, 0, 0.0, 304.66225165562906, 245, 1309, 270.0, 391.20000000000005, 440.20000000000005, 920.5599999999923, 0.2660680429373912, 0.13225452524915246, 0.10731064622377204], "isController": false}, {"data": ["Buy monitor-737", 151, 0, 0.0, 429.6754966887418, 364, 1212, 404.0, 504.6000000000001, 534.8, 907.799999999994, 0.2660150765365894, 0.13222819722375392, 0.10754906414662893], "isController": false}, {"data": ["Buy phone-663", 368, 0, 0.0, 334.16304347826093, 272, 1014, 309.0, 413.20000000000005, 457.20000000000005, 597.8000000000002, 0.624303384301145, 0.3550009797152294, 0.2542329211460717], "isController": false}, {"data": ["Buy phone-661", 368, 0, 0.0, 305.91304347826053, 249, 659, 272.0, 406.1, 445.8000000000002, 559.7400000000001, 0.624291734241723, 0.31031688743070024, 0.24813157796521612], "isController": false}, {"data": ["Buy phone-662", 368, 0, 0.0, 339.2663043478261, 276, 966, 314.0, 422.30000000000007, 473.1, 583.99, 0.6243341001784781, 0.9201667893491656, 0.1963238088451855], "isController": false}, {"data": ["Logout-840", 147, 0, 0.0, 340.013605442177, 280, 507, 314.0, 421.80000000000007, 457.59999999999997, 506.04, 0.26402142345264584, 0.3891565772765561, 0.08302236167163278], "isController": false}, {"data": ["Buy monitor-739", 151, 0, 0.0, 329.9999999999999, 266, 683, 309.0, 403.80000000000007, 432.00000000000006, 638.7999999999992, 0.26602070028628055, 0.15128138075313807, 0.11014919621228804], "isController": false}, {"data": ["Signup-581", 376, 0, 0.0, 134.0265957446808, 47, 1314, 53.0, 267.0, 287.7499999999999, 1296.2200000000003, 0.6373896858143501, 0.29975644424704956, 0.22283740968900131], "isController": false}, {"data": ["Buy laptop-712", 362, 0, 0.0, 334.63812154696126, 277, 1268, 309.0, 404.7, 435.84999999999997, 617.4400000000005, 0.6296177767883232, 0.9279850752758492, 0.19798527746664069], "isController": false}, {"data": ["Place order-812", 147, 0, 0.0, 83.86394557823127, 47, 291, 52.0, 258.0, 266.2, 283.32000000000016, 0.264142399706748, 0.12433265298696537, 0.09492617489461257], "isController": false}, {"data": ["Buy laptop-711", 363, 0, 0.0, 302.7245179063361, 246, 1106, 274.0, 379.6, 417.6, 500.0400000000002, 0.6313559543127873, 0.3138350955425922, 0.25093932949736764], "isController": false}, {"data": ["Buy laptop-710", 363, 0, 0.0, 83.40771349862261, 47, 306, 52.0, 257.6, 264.0, 279.32000000000016, 0.6313998813733557, 0.2972290753122646, 0.22690933236854968], "isController": false}, {"data": ["Place order-814", 147, 0, 0.0, 338.91156462585036, 276, 1013, 310.0, 427.20000000000005, 461.5999999999999, 780.2000000000049, 0.26397448605783735, 0.38905407402868164, 0.08300760206115589], "isController": false}, {"data": ["Place order-813", 147, 0, 0.0, 298.47619047619065, 247, 533, 274.0, 371.0, 412.2, 497.0000000000008, 0.2640418156018178, 0.13124734779426292, 0.1049463075683006], "isController": false}, {"data": ["Buy laptop-675", 365, 0, 0.0, 191.9616438356165, 53, 1635, 262.0, 293.80000000000007, 310.0, 610.6199999999951, 0.6193715669421881, 3.246962971443577, 0.24012745319926626], "isController": false}, {"data": ["Place order-815", 147, 0, 0.0, 336.7142857142858, 274, 1422, 311.0, 398.20000000000005, 451.79999999999995, 997.680000000009, 0.2639436776511526, 0.1500920155690859, 0.10748487654348696], "isController": false}, {"data": ["Buy monitor-761", 151, 0, 0.0, 335.0132450331124, 281, 524, 310.0, 418.20000000000005, 456.4000000000001, 516.7199999999998, 0.26591904085995755, 0.3919254965509772, 0.08361907339541633], "isController": false}, {"data": ["Buy monitor-760", 151, 0, 0.0, 301.98675496688736, 244, 561, 269.0, 386.80000000000007, 440.6, 554.2399999999999, 0.265987898431376, 0.13221468779450232, 0.10571979947418948], "isController": false}, {"data": ["Buy monitor-762", 151, 0, 0.0, 326.3509933774833, 267, 612, 304.0, 399.6, 430.0000000000001, 594.8399999999997, 0.2659293438061357, 0.15120363022172517, 0.10829349254605332], "isController": false}, {"data": ["Buy laptop-713", 361, 0, 0.0, 323.3795013850416, 273, 551, 304.0, 393.8, 420.9, 511.0, 0.6279571388811578, 0.3570123465984205, 0.255720827063909], "isController": false}, {"data": ["Buy monitor-724", 151, 0, 0.0, 360.4172185430463, 173, 1447, 395.0, 442.8, 496.2000000000001, 1441.8, 0.26594761008205625, 1.394640866703007, 0.10336635626236174], "isController": false}, {"data": ["Login-614", 371, 0, 0.0, 326.95417789757414, 274, 575, 302.0, 411.40000000000003, 452.79999999999995, 548.6799999999998, 0.6293031358293995, 0.35774984797494996, 0.25012341433844293], "isController": false}, {"data": ["Login-613", 371, 0, 0.0, 338.78975741239884, 267, 938, 313.0, 419.0, 452.9999999999999, 589.159999999998, 0.6292102817369596, 0.9273309161666338, 0.19171250771672985], "isController": false}, {"data": ["Login-610", 374, 0, 0.0, 404.0588235294117, 130, 2490, 378.0, 971.5, 1181.75, 2204.5, 0.6342681156470892, 113.40836330843747, 0.24466397039121116], "isController": false}, {"data": ["Signup-591", 375, 0, 0.0, 326.9786666666668, 269, 566, 305.0, 398.40000000000003, 451.4, 527.44, 0.6358658882537767, 0.3242998825131794, 0.253973777632612], "isController": false}, {"data": ["Login-612", 373, 0, 0.0, 295.28418230563017, 243, 601, 268.0, 371.80000000000007, 408.6, 508.6399999999999, 0.6325861580651343, 0.3144596735863904, 0.24525068823423662], "isController": false}, {"data": ["Login-611", 373, 0, 0.0, 73.97587131367298, 47, 1299, 51.0, 92.60000000000002, 262.0, 276.78, 0.6327524902966642, 0.2978452010473495, 0.23728218386124905], "isController": false}, {"data": ["Signup-590", 376, 0, 0.0, 428.02925531914883, 357, 1260, 405.0, 506.6, 543.0, 628.6800000000003, 0.637321621983528, 0.3168002789129598, 0.247708989794379], "isController": false}, {"data": ["Buy laptop-689", 365, 0, 0.0, 305.1041095890412, 247, 1063, 272.0, 398.40000000000003, 441.4, 551.0799999999984, 0.6193747200086882, 0.3078727856293187, 0.24920154750349566], "isController": false}, {"data": ["Buy laptop-688", 364, 0, 0.0, 299.3406593406593, 237, 510, 270.0, 391.0, 435.25, 490.10000000000014, 0.6325946111281039, 0.31444400103926257, 0.25513825624600284], "isController": false}, {"data": ["Buy laptop-687", 365, 0, 0.0, 76.31232876712328, 47, 299, 51.0, 255.40000000000003, 262.0, 269.34, 0.619650211699675, 0.2916978171760248, 0.22631755778874849], "isController": false}, {"data": ["Cart-789", 149, 0, 0.0, 326.6442953020134, 270, 592, 306.0, 402.0, 449.5, 540.0, 0.2622953128355708, 0.1993517267921459, 0.0970800034811341], "isController": false}, {"data": ["Cart-788", 149, 0, 0.0, 332.0939597315437, 276, 594, 308.0, 414.0, 448.5, 562.5, 0.26228053807996565, 0.17652744033117757, 0.0968184017521748], "isController": false}, {"data": ["Cart-787", 149, 0, 0.0, 326.1543624161075, 264, 652, 303.0, 401.0, 445.5, 611.5, 0.26231701627597864, 0.18296481221886746, 0.09683186733624992], "isController": false}, {"data": ["Cart-786", 149, 0, 0.0, 294.295302013423, 250, 507, 271.0, 364.0, 398.0, 479.5, 0.2623193253639901, 0.1303911490334677, 0.10374934255118748], "isController": false}, {"data": ["Buy phone-645", 368, 0, 0.0, 146.32336956521738, 52, 1354, 65.5, 283.20000000000005, 303.55, 858.7500000000007, 0.6241805510089505, 2.9986214599379553, 0.24199187377983727], "isController": false}, {"data": ["Cart-781", 151, 0, 0.0, 295.5562913907285, 249, 514, 270.0, 361.0, 400.40000000000003, 492.15999999999957, 0.26594339456489197, 0.13222008522076825, 0.10622153161820393], "isController": false}, {"data": ["Cart-780", 151, 0, 0.0, 309.9933774834436, 245, 578, 277.0, 424.8, 476.8, 569.6799999999998, 0.26594339456489197, 0.13219256624368164, 0.10544240057943959], "isController": false}, {"data": ["Signup-563-1", 377, 0, 0.0, 311.0053050397878, 172, 1448, 243.0, 427.2, 503.2999999999999, 772.819999999999, 0.6387686844076056, 3.068594141288178, 0.208348379484512], "isController": false}, {"data": ["Buy phone-643", 369, 0, 0.0, 301.2303523035229, 248, 1139, 273.0, 380.0, 413.0, 494.00000000000034, 0.6255318716117023, 0.3109333229007388, 0.25473319381062487], "isController": false}, {"data": ["Signup-563-0", 377, 0, 0.0, 285.71618037135266, 258, 608, 278.0, 306.0, 317.09999999999997, 456.69999999999897, 0.6390989552342544, 0.17967208406863616, 0.23966210821284537], "isController": false}, {"data": ["Buy phone-644", 369, 0, 0.0, 354.6368563685636, 284, 736, 340.0, 427.0, 465.0, 576.1000000000006, 0.6255233884720616, 0.2242064705012324, 0.30359875397520963], "isController": false}, {"data": ["Buy monitor-759", 151, 0, 0.0, 76.75496688741721, 47, 1297, 51.0, 80.60000000000002, 259.8, 780.1199999999899, 0.2660788262928171, 0.12523725178457837, 0.09562207819898115], "isController": false}, {"data": ["Buy phone-641", 369, 0, 0.0, 336.4308943089432, 270, 3524, 302.0, 406.0, 452.5, 594.1000000000013, 0.625981807509746, 0.42138832406094245, 0.23718841925173967], "isController": false}, {"data": ["Cart-785", 149, 0, 0.0, 302.8590604026844, 252, 725, 272.0, 383.0, 444.5, 712.0, 0.26234334228939465, 0.13040308713408386, 0.10375884143281722], "isController": false}, {"data": ["Cart-784", 149, 0, 0.0, 306.18120805369136, 243, 1136, 273.0, 385.0, 444.5, 841.0, 0.2623525807394469, 0.13041455724480489, 0.10376249531198828], "isController": false}, {"data": ["Cart-783", 150, 0, 0.0, 349.6400000000001, 284, 641, 327.5, 432.9000000000001, 473.5999999999999, 597.1400000000008, 0.2640826473053007, 0.15145552452095407, 0.11140986683192372], "isController": false}, {"data": ["Buy phone-640", 369, 0, 0.0, 329.5365853658535, 272, 881, 304.0, 406.0, 447.5, 640.3000000000018, 0.6254534113483352, 0.35566107904273425, 0.2583660087894002], "isController": false}, {"data": ["Cart-782", 151, 0, 0.0, 325.07947019867566, 267, 845, 301.0, 408.0, 441.20000000000005, 744.1199999999981, 0.2659232556050811, 0.15117953088760253, 0.10803132258956419], "isController": false}, {"data": ["Signup-564", 376, 0, 0.0, 74.46808510638294, 53, 532, 63.0, 73.0, 101.79999999999973, 289.6100000000001, 0.6375528821290197, 3.0632026222753517, 0.21044225992149282], "isController": false}, {"data": ["Buy laptop-693", 363, 0, 0.0, 306.39669421487605, 247, 1202, 276.0, 382.6, 433.20000000000005, 593.360000000001, 0.6308841241399208, 0.31360734664997053, 0.25691277320932315], "isController": false}, {"data": ["Signup-562", 377, 0, 0.0, 99.33952254641903, 75, 812, 92.0, 110.0, 119.09999999999997, 306.5399999999998, 0.6392864410228583, 0.4997687594324425, 0.1716833703918809], "isController": false}, {"data": ["Buy laptop-691", 363, 0, 0.0, 322.6528925619833, 269, 714, 302.0, 390.6, 432.20000000000005, 511.1600000000001, 0.630854521124068, 0.35872010012425926, 0.26059713128464923], "isController": false}, {"data": ["Signup-563", 377, 0, 0.0, 596.8143236074271, 440, 1745, 569.0, 724.2, 821.5999999999998, 1068.6599999999999, 0.6383955105724731, 3.2462757660111117, 0.4476249771396833], "isController": false}, {"data": ["Buy laptop-690", 363, 0, 0.0, 332.1542699724516, 272, 1033, 305.0, 418.0, 455.40000000000003, 559.08, 0.6307602485508153, 0.4399482821122997, 0.23899900042745736], "isController": false}, {"data": ["Logout-823", 147, 0, 0.0, 74.9931972789116, 55, 281, 64.0, 78.0, 259.59999999999997, 280.04, 0.26406031353120496, 1.2687343045783028, 0.10082771737373156], "isController": false}, {"data": ["Signup-560", 377, 0, 0.0, 234.58620689655186, 185, 1206, 208.0, 246.59999999999997, 417.2999999999999, 1195.5399999999997, 0.6391379605565417, 0.5153841179938528, 0.17039517893743739], "isController": false}, {"data": ["Buy phone-638", 370, 0, 0.0, 297.718918918919, 244, 615, 269.0, 377.90000000000003, 413.1499999999999, 526.8200000000012, 0.6279221715924616, 0.31212809930504287, 0.2532537664723502], "isController": false}, {"data": ["Signup-561", 377, 0, 0.0, 99.63660477453577, 74, 329, 92.0, 116.0, 130.19999999999993, 310.1999999999997, 0.63925717299113, 0.5006450329548094, 0.17105123574176725], "isController": false}, {"data": ["Buy phone-639", 370, 0, 0.0, 299.8648648648649, 245, 721, 272.0, 372.60000000000014, 422.24999999999994, 552.0200000000008, 0.6276888834602283, 0.31201213623732743, 0.2525466992047012], "isController": false}, {"data": ["Buy phone-637", 370, 0, 0.0, 68.15405405405406, 47, 307, 51.0, 75.7000000000001, 256.9, 275.29, 0.6280969849647162, 0.2956538447174497, 0.22940260974297252], "isController": false}, {"data": ["Buy laptop-695", 363, 0, 0.0, 101.93663911845735, 53, 1562, 62.0, 269.0, 275.8, 601.200000000002, 0.6311002006307525, 3.0321917062480654, 0.24467458950235227], "isController": false}, {"data": ["Monitor-721", 361, 0, 0.0, 332.23822714681455, 272, 733, 313.0, 405.0, 449.9, 561.9999999999998, 0.627929831885268, 0.5165527347996626, 0.23915296331567826], "isController": false}, {"data": ["Buy laptop-694", 363, 0, 0.0, 355.83471074380145, 284, 730, 339.0, 427.6, 463.40000000000003, 574.9600000000005, 0.6307229857696385, 0.22605691981738574, 0.30612238664795927], "isController": false}, {"data": ["Monitor-720", 361, 0, 0.0, 308.30193905817174, 244, 1121, 272.0, 396.8, 437.79999999999995, 675.1799999999981, 0.6280215928088918, 0.31217768498802234, 0.2496140510480654], "isController": false}, {"data": ["Place order-793", 149, 0, 0.0, 1074.1476510067107, 989, 1717, 1038.0, 1178.0, 1267.5, 1683.5, 0.26198401018396905, 1316.9682236967615, 0.19444125755841454], "isController": false}, {"data": ["Place order-795", 148, 0, 0.0, 455.135135135135, 277, 755, 448.0, 563.4, 596.4999999999998, 731.4799999999996, 0.26581128117445485, 0.10306080343255758, 0.105390019684403], "isController": false}, {"data": ["Buy monitor-740", 151, 0, 0.0, 322.48344370860934, 273, 590, 303.0, 402.20000000000005, 437.20000000000005, 549.9599999999992, 0.2659747799543087, 0.20214730048809015, 0.10129898845916055], "isController": false}, {"data": ["Place order-794", 148, 0, 0.0, 298.3310810810812, 249, 480, 276.0, 381.1, 393.65, 473.6299999999999, 0.2659368974867167, 0.13218933673900268, 0.10673834459671927], "isController": false}, {"data": ["Place order-796", 147, 0, 0.0, 101.69387755102045, 56, 329, 66.0, 272.0, 276.6, 306.92000000000047, 0.26413812806925807, 1.269094143231146, 0.10059948237012759], "isController": false}, {"data": ["Login-594", 374, 0, 0.0, 81.32887700534756, 54, 299, 64.0, 92.0, 271.5, 283.5, 0.6345726729931639, 3.0489366453841624, 0.2255707548530387], "isController": false}, {"data": ["Buy monitor-743", 151, 0, 0.0, 367.08609271523187, 286, 726, 345.0, 439.8, 491.8, 670.3599999999989, 0.2659447997224311, 0.0953210804623917, 0.12959614752098939], "isController": false}, {"data": ["Buy monitor-742", 151, 0, 0.0, 293.4768211920529, 246, 457, 269.0, 364.40000000000003, 402.8, 454.91999999999996, 0.2659864928183647, 0.13222086996519278, 0.10857651757624653], "isController": false}, {"data": ["Login-593", 374, 0, 0.0, 356.5989304812831, 281, 697, 338.5, 433.5, 470.5, 562.75, 0.6342078845266842, 0.3178888858035787, 0.25269220399110076], "isController": false}, {"data": ["Cart-772", 151, 0, 0.0, 211.97350993377478, 57, 1361, 264.0, 297.0, 415.20000000000016, 1359.44, 0.2659466732889149, 1.4777546092653355, 0.10128828377214534], "isController": false}, {"data": ["Login-592", 374, 0, 0.0, 305.2620320855617, 243, 1222, 273.5, 387.5, 421.25, 536.0, 0.6342777967156621, 0.3152939120779042, 0.24590652860949005], "isController": false}, {"data": ["Buy monitor-744", 151, 0, 0.0, 136.8874172185431, 55, 868, 68.0, 280.0, 286.0, 679.2399999999963, 0.266079295154185, 1.2783383810572688, 0.1034175385462555], "isController": false}, {"data": ["Phone-623", 371, 0, 0.0, 336.3800539083559, 271, 636, 313.0, 419.8, 453.4, 524.0399999999995, 0.6293981528606232, 0.7585882602612257, 0.23233642752081596], "isController": false}, {"data": ["Phone-622", 371, 0, 0.0, 300.0566037735848, 246, 1041, 270.0, 381.6, 415.5999999999999, 527.3199999999988, 0.6293896108302515, 0.31285751736759065, 0.24401140185508768], "isController": false}, {"data": ["Logout-839", 147, 0, 0.0, 89.73469387755104, 47, 312, 51.0, 261.20000000000005, 267.6, 292.8000000000004, 0.26406410829861876, 0.1242958009764983, 0.09489803891981613], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23696, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
