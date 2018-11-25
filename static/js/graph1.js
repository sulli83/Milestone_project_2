  queue()
            .defer(d3.csv, "/housing data/Social Housing Construction Status Report Q1 2017.csv")
            .await(makeGraphs);
        
        function makeGraphs(error, housingData) {
            var ndx = crossfilter(housingData);
           
           
            var name_dim = ndx.dimension(dc.pluck('LA'));
            var total_number_of_units = name_dim.group().reduceSum(dc.pluck('No. of Units'));
            dc.pieChart('#units_per_LA_2')
                .height(1000)
                .radius(400)
                .transitionDuration(1500)
                .dimension(name_dim)
                .group(total_number_of_units);
            
            
            var FP_dim = ndx.dimension(dc.pluck('Funding Programme'));
            var total_units_per_FP = FP_dim.group().reduceSum(dc.pluck('No. of Units'));
            dc.pieChart('#per-store-chart_2')
                .height(330)
                .radius(400)
                .transitionDuration(1500)
                .dimension(FP_dim)
                .group(total_units_per_FP);
            /*
            var state_dim = ndx.dimension(dc.pluck('state'));
            var total_spend_per_state = name_dim.group().reduceSum(dc.pluck('spend'));
            dc.pieChart('#per-state-chart')
                .height(330)
                .radius(90)
                .transitionDuration(1500)
                .dimension(name_dim)
                .group(total_spend_per_state);
            */
            dc.renderAll();
        }
        