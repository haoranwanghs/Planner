import useSWR from 'swr';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Chart, { ReactGoogleChartProps } from 'react-google-charts';
import { Button } from '@mui/material';

let localData = {
  deadLineWeekId: 8,
  plannedProjects: [
    {
      id: 'uuid1',
      name: 'A',
      priority: 1,
      subProjectIds: ['uuid1', 'uuid2'],
      earliestStartWeekId: 1,
      latestCompleteWeekId: 4,
      actualStartWeekId: 1,
      actualEndWeekId: 3,
      memberPlannedSubProjectsMap: {
        'Member(name=member2, tag=backend)': [
          {
            id: 'uuid2',
            projectId: 'uuid2',
            name: 'A-dev',
            manWeekEstimation: 1,
            dependsOnSubProjectIds: ['uuid1'],
            actualStartWeekId: 2,
            actualEndWeekId: 3
          }
        ],
        'Member(name=member1, tag=pm)': [
          {
            id: 'uuid1',
            projectId: 'uuid1',
            name: 'A-prd',
            manWeekEstimation: 1,
            actualStartWeekId: 1,
            actualEndWeekId: 1,
            dependeeSubprojectIds: ['uuid2']
          }
        ]
      }
    },
    {
      id: 'uuid2',
      name: 'B',
      priority: 2,
      subProjectIds: ['uuid3', 'uuid4', 'uuid5'],
      earliestStartWeekId: 1,
      latestCompleteWeekId: 8,
      actualStartWeekId: 2,
      actualEndWeekId: 6,
      memberPlannedSubProjectsMap: {
        'Member(name=member2, tag=backend)': [
          {
            id: 'uuid4',
            projectId: 'uuid2',
            name: 'B-dev1',
            manWeekEstimation: 1,
            dependsOnSubProjectIds: ['uuid3'],
            actualStartWeekId: 4,
            actualEndWeekId: 4,
            dependeeSubprojectIds: ['uuid5']
          }
        ],
        'Member(name=member3, tag=frontend)': [
          {
            id: 'uuid5',
            projectId: 'uuid2',
            name: 'B-dev2',
            manWeekEstimation: 1,
            dependsOnSubProjectIds: ['uuid4'],
            actualStartWeekId: 5,
            actualEndWeekId: 6
          }
        ],
        'Member(name=member1, tag=pm)': [
          {
            id: 'uuid3',
            projectId: 'uuid2',
            name: 'B-prd',
            manWeekEstimation: 1,
            actualStartWeekId: 2,
            actualEndWeekId: 2,
            dependeeSubprojectIds: ['uuid2']
          }
        ]
      }
    }
  ],
  unplannedProjects: {
    uuid3: [
      {
        id: 'uuid6',
        projectId: 'uuid3',
        name: 'C-prd',
        priority: 3,
        manWeekEstimation: 1,
        reason: 'not enough resource'
      },
      {
        id: 'uuid7',
        projectId: 'uuid3',
        name: 'C-dev',
        priority: 3,
        manWeekEstimation: 1,
        reason: 'not enough resource'
      }
    ]
  }
};

google.charts.load('current', { packages: ['gantt'] });
google.charts.load('current', { packages: ['timeline'] });

// google.charts.setOnLoadCallback(drawChart);

function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

function drawDepChart(rows) {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Task ID');
  data.addColumn('string', 'Task Name');
  data.addColumn('date', 'Start Date');
  data.addColumn('date', 'End Date');
  data.addColumn('number', 'Duration');
  data.addColumn('number', 'Percent Complete');
  data.addColumn('string', 'Dependencies');

  data.addRows(
    rows ?? [
      ['Research', 'Find sources', new Date(2015, 0, 1), new Date(2015, 0, 5), null, 100, null],
      [
        'Write',
        'Write paper',
        null,
        new Date(2015, 0, 9),
        daysToMilliseconds(3),
        25,
        'Research,Outline'
      ],
      [
        'Cite',
        'Create bibliography',
        null,
        new Date(2015, 0, 7),
        daysToMilliseconds(1),
        20,
        'Research'
      ],
      [
        'Complete',
        'Hand in paper',
        null,
        new Date(2015, 0, 10),
        daysToMilliseconds(1),
        0,
        'Cite,Write'
      ],
      [
        'Outline',
        'Outline paper',
        null,
        new Date(2015, 0, 6),
        daysToMilliseconds(1),
        100,
        'Research'
      ]
    ]
  );

  var options = {
    height: 275
  };

  var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

  chart.draw(data, options);
}

const startDate = new Date(2023, 5, 15);
const addWeeksToDate = (dateObj,numberOfWeeks) => {
  dateObj.setDate(dateObj.getDate()+ numberOfWeeks * 7);
  return dateObj;
}
function getDate(weekId) {
  return addWeeksToDate(startDate, weekId); 
}

const timelineRowFormatter  = (name, subprojectName, actualStartWeekId, actualEndWeekId) =>{
  return [ name, null, subprojectName, getDate(actualStartWeekId), getDate(actualEndWeekId) ]
}

function drawTimelineChart(rawData) {
  var container = document.getElementById('example2.1');
  var chart = new google.visualization.Timeline(container);
  var dataTable = new google.visualization.DataTable();

  dataTable.addColumn({ type: 'string', id: 'Term' });
  dataTable.addColumn({ type: 'string', id: 'Name' });
  dataTable.addColumn({ type: 'string', role: 'tooltip' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });

  let rows = []
  rawData.plannedProjects.map((project)=>{
    const name = project.name;

    Object.keys(project.memberPlannedSubProjectsMap).map((key)=>{
      const projectFormember = project.memberPlannedSubProjectsMap[key];
      console.log(key,projectFormember)
      projectFormember.map((subp)=>{
        console.log(key,subp)

        rows.push(timelineRowFormatter(`${name}- ${key}`, subp.name, subp.actualStartWeekId,subp.actualEndWeekId))

      })
    })
  })

  console.log(rows)
  dataTable.addRows(rows);
  chart.draw(dataTable);
}

const fetcher = (...args) => Promise.resolve(localData);

function useChartData(id) {
  const { data, error, isLoading } = useSWR(`/api/planedprojects/${id}`, fetcher);

  return {
    data,
    isLoading,
    isError: error
  };
}

function generateProps(data) {
  return {
    chartType: 'Gantt',
    // columns:
    columns: [
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Priority' },
      { type: 'string', label: 'Dependencies' }
    ],
    rows: [
      ['Research', 'Find sources', new Date(2015, 0, 1), new Date(2015, 0, 5), null, 100, null],
      [
        'Write',
        'Write paper',
        null,
        new Date(2015, 0, 9),
        daysToMilliseconds(3),
        25,
        'Research,Outline'
      ],
      [
        'Cite',
        'Create bibliography',
        null,
        new Date(2015, 0, 7),
        daysToMilliseconds(1),
        20,
        'Research'
      ],
      [
        'Complete',
        'Hand in paper',
        null,
        new Date(2015, 0, 10),
        daysToMilliseconds(1),
        0,
        'Cite,Write'
      ],
      [
        'Outline',
        'Outline paper',
        null,
        new Date(2015, 0, 6),
        daysToMilliseconds(1),
        100,
        'Research'
      ]
    ]
  };
}

function ChartPanel() {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const refresh = () => setRefreshFlag((prev) => prev + 1);
  const { data } = useChartData(refreshFlag);

  useEffect(() => {
    setTimeout(()=>{
      console.log(data)
      drawDepChart();
      if(data){
        drawTimelineChart(data);
      }
    },2000)
  }, [refresh,data]);
  return (
    <div>
      <div>
        <Button variant="outlined" onClick={refresh}>
          Reload
        </Button>
      </div>
      <div style={{ overflow: 'scroll' }}>
        {/* <Chart chartType='Gantt' options={generateProps({})} width="100%" height="400px" legendToggle /> */}
        <div id="example2.1" style={{ height: '200px', width: '1000px' }}></div>

        <div id="chart_div"></div>
      </div>
    </div>
  );
}
export { ChartPanel };
