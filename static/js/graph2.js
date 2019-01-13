 queue()
            .defer(d3.csv, "/housing_data/Social Housing Construction Status Report Q1 2018.csv")
            .await(makeGraphs);
        
        function makeGraphs(error, housingData) {
            var ndx = crossfilter(housingData);
            
            
          
            
            var LA_dim = ndx.dimension(dc.pluck('LA'));
            var total_number_of_units = LA_dim.group().reduceSum(dc.pluck('Units'));
            dc.pieChart('#number_of_units_per_LA')
                .height(400)
                .radius(300)
                .transitionDuration(1500)
                .dimension(LA_dim)
                .group(total_number_of_units);
            
            var funding_programme_dim = ndx.dimension(dc.pluck('Funding Programme'));
            var total_number_of_units_per_funding_programme = funding_programme_dim.group().reduceSum(dc.pluck('Units'));
            dc.pieChart('#number_of_units_per_funding_programme')
                .height(400)
                .radius(300)
                .transitionDuration(1500)
                .dimension(funding_programme_dim)
                .group(total_number_of_units_per_funding_programme);
                
           
     
                
          var size_dimension = ndx.dimension(function (d) {
            if (d.Units > 100)
                return "Large development";
            else if (d.Units > 50)
                return "Large/Medium development";
            else if (d.Units > 25)
                return "Medium development";
            else if (d.Units > 10)
                return "Small development";
            else
                return "Very small development";
        });
        
        var devSizeColors = d3.scale.ordinal()
        .domain(["Large Development","Medium Development","Small Development"])
        .range(["red", "orange", "blue"]);
        
        var size_group = size_dimension.group();
        dc.pieChart('#pie-chart')
            .height(650)
             .transitionDuration(500)
            .radius(600)
            .colors(devSizeColors)
            .dimension(size_dimension)
            .group(size_group);
            
             var size_dimension = ndx.dimension(function (d) {
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
   
            
        var name_dim = ndx.dimension(dc.pluck('LA'));
        var total_spend_per_person = name_dim.group().reduceSum(dc.pluck('Units'));
        dc.rowChart("#LA_rowChart")
            .width(800)
            .height(2000)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(name_dim)
            .group(total_spend_per_person)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            /*.xUnits(dc.units.ordinal)*/
            /*.xAxisLabel("Units")*/
            .elasticX(true)
            .xAxis().ticks(10);
            
         
          var name_dim = ndx.dimension(dc.pluck('Approved Housing Body'));
        var total_spend_per_person = name_dim.group().reduceSum(dc.pluck('Units'));
        dc.rowChart("#AHB_rowChart")
            .width(800)
            .height(2000)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(name_dim)
            .group(total_spend_per_person)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            /*.xUnits(dc.units.ordinal)*/
            /*.xAxisLabel("Units")*/
            .elasticX(true)
            .xAxis().ticks(10);
            
            
         
        var completion_date = ndx.dimension(dc.pluck('Completed'));
        var total_units = name_dim.group().reduceSum(dc.pluck('Units'));
        dc.rowChart('#completed_rowChart')
            .width(800)
            .height(2000)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(completion_date)
            .group(total_units)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            /*.xUnits(dc.units.ordinal)*/
            /*.xAxisLabel("Units")*/
            .elasticX(true)
            .xAxis().ticks(10);
            
          
            
        
            
            
            dc.renderAll();
        } 
        