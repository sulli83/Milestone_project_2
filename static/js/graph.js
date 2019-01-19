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
            .radius(300)
            .innerRadius(50)
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