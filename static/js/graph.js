   

queue()
.defer(d3.csv, "/housing_data/soc_housing.csv")
.await(makeSocialGraphs) 
     function makeSocialGraphs(error, housingData) {
            var ndx = crossfilter(housingData);
            
            
          
            /*piechart for Local Authority and units*/
            var LA_dim = ndx.dimension(dc.pluck('LA'));
            var total_number_of_units = LA_dim.group().reduceSum(dc.pluck('Units'));
            dc.pieChart('#number_of_units_per_LA')
                .height(400)
                .radius(300)
                .attr('fill','black')
                .innerRadius(50)
                .transitionDuration(1500)
                .dimension(LA_dim)
                .group(total_number_of_units);
            
            /*piechart for funding programme information*/
            var funding_programme_dim = ndx.dimension(dc.pluck('Funding Programme'));
            var total_number_of_units_per_funding_programme = funding_programme_dim.group().reduceSum(dc.pluck('Units'));
            dc.pieChart('#number_of_units_per_funding_programme')
                .height(400)
                .radius(300)
                .innerRadius(50)
                .transitionDuration(1500)
                .dimension(funding_programme_dim)
                .group(total_number_of_units_per_funding_programme);
                
           
     
          /*size of developments */      
          var size_dimension = ndx.dimension(function (d) {
            if (d.Units > 100)
                return "Large development (100+ Units)";
            else if (d.Units > 50)
                return "Large/Medium development (100-50 Units)";
            else if (d.Units > 25)
                return "Medium development (50-25 Units)";
            else if (d.Units > 10)
                return "Small development (25-10 Units)";
            else
                return "Very small development (Under 10 Units)";
        });
        
        var devSizeColors = d3.scale.ordinal()
        .domain(["Large development (100+ Units)","Large/Medium development (100-50 Units)","Medium development (50-25 Units)",
        "Small development (25-10 Units)","Very small development (Under 10 Units)"])
        .range(["red", "orange", "blue","green","yellow"]);
        
        var size_group = size_dimension.group();
        dc.pieChart('#pie-chart')
            .height(400)
             .transitionDuration(500)
            .radius(null)
         
            .colors(devSizeColors)
            .dimension(size_dimension)
            .group(size_group);
            
          /*   var size_dimension = ndx.dimension(function (d) {
            if (d.Units > 50)
                return "Large and medium development";
            else
                return "Small development"
        });
        var size_group = size_dimension.group();
        dc.pieChart('#pie-chart-2')
            .height(400)
            .radius(300)
            .dimension(size_dimension)
            .group(size_group);
   */
    
            
        /*barchart for AHB Bar Chart*/ 
        var name_dim = ndx.dimension(dc.pluck('Approved Housing Body'));
        var total_units_per_ahb = name_dim.group().reduceSum(dc.pluck('Units'));
        dc.rowChart("#AHB_rowChart")
            .width(500)
            .height(1000)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(name_dim)
            .group(total_units_per_ahb)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            /*.xUnits(dc.units.ordinal)*/
            /*.xAxisLabel("Units")*/
            .elasticX(true)
            .xAxis().ticks(10);
         
         
         /*java script for Local Authority Bar Chart information.*/   
        var name_dim = ndx.dimension(dc.pluck('LA'));
        var total_units_per_local_authority = name_dim.group().reduceSum(dc.pluck('Units'));
        dc.rowChart("#LA_rowChart")
            .width(500)
            .height(1000)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(name_dim)
            .group(total_units_per_local_authority)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            /*.xUnits(dc.units.ordinal)*/
            /*.xAxisLabel("Units")*/
            .elasticX(true)
            .xAxis().ticks(10);
         
            
            
            dc.renderAll();
        }
{
queue()
.defer(d3.json, "/housing_data/esb_connections.json")
.await(makeESBGraphs)
 function makeESBGraphs(error, esb_connectionsData) {
        var ndx = crossfilter(esb_connectionsData);
        
        var parseDate = d3.time.format("%Y").parse;
        esb_connectionsData.forEach(function(d){
            d.date = parseDate(d.date);
        });
        
        var date_dim = ndx.dimension(dc.pluck('date'));
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;
        function units_by_owner(owner) {
            return function(d) {
                if (d.owner === owner) {
                    return +d.units;
                } else {
                    return 0;
                }
            }
        }
        var PrivateUnitsByDate = date_dim.group().reduceSum(units_by_owner('Private'));
        var SocialUnitsByDate = date_dim.group().reduceSum(units_by_owner('Social'));
        
       
        var compositeChart = dc.compositeChart('#composite-chart');
        compositeChart
            .width(990)
            .height(200)
            .dimension(date_dim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .yAxisLabel("units")
            .xAxisLabel("date")
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('green')
                    .group(PrivateUnitsByDate, 'Private'),
                dc.lineChart(compositeChart)
                    .colors('red')
                    .group(SocialUnitsByDate, 'Social')
               ])
            .brushOn(false)
            .render();
            
        /*functions and variables for private and social houses*/
        
        
        var date_dim = ndx.dimension(dc.pluck('date'));
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;
        function units_by_name(name) {
            return function(d) {
                if (d.name === name) {
                    return +d.units;
                } else {
                    return 0;
                }
            }
        }
        var LAunitsByDate = date_dim.group().reduceSum(units_by_name('LA'));
        var SocunitsByDate = date_dim.group().reduceSum(units_by_name('Soc'));
        
        var PrivunitsByDate = date_dim.group().reduceSum(units_by_name('Priv'));
        var compositeChart = dc.compositeChart('#composite-chart-1');
        compositeChart
            .width(990)
            .height(200)
            .dimension(date_dim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .yAxisLabel("units")
            .xAxisLabel("date")
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('green')
                    .group(LAunitsByDate, 'SocialHousing - Local Authority'),
                dc.lineChart(compositeChart)
                    .colors('red')
                    .group(SocunitsByDate, 'Social Housing - Voluntary & Co-operative Housing'),
                dc.lineChart(compositeChart)
                    .colors('blue')
                    .group(PrivunitsByDate, 'Private Ownership')
            ])
            .brushOn(false)
            .render();
         
         
         /*code for bar chart*/ 
         var name_dim = ndx.dimension(dc.pluck('owner'));

        var unitsByFpDub = name_dim.group().reduceSum(function (d) {
            if (d.owner === 'Private') {
                return +d.units;
            } else {
                return 0;
            }
        });

        var unitsByFpCor = name_dim.group().reduceSum(function (d) {
            if (d.owner === 'Social') {
                return +d.units;
            } else {
                return 0;
            }
        });

        var stackedChart = dc.barChart("#bar-chart");
        stackedChart
            .width(800)
            .height(500)
            .dimension(name_dim)
            .group(unitsByFpDub, "Private")
            .stack(unitsByFpCor, "Social")
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5));

        stackedChart.margins().right = 100;
            
        
   
        
        dc.renderAll();
        }        
        
        }
        
    
