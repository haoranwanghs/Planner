import useSWR from 'swr';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import {
  getDependencies,
  getIdFromName,
  setTextAsSoleChild,
  getSubsetIndices,
  destroyAndMountNewNode
} from './utils';
import Chip from '@mui/material/Chip';

let localData = {
  deadLineWeekId: null,
  plannedProjects: [
    {
      id: 'project-uuid-C',
      name: 'smp-plan-management',
      priority: 3,
      subProjectIds: ['C2', 'C3', 'C1'],
      memberPlannedSubProjectsMap: {
        'Member(name=Deepak, tag=pm)': [
          {
            id: 'C1',
            projectId: 'project-uuid-C',
            name: 'smp-plan-management-prd',
            dependsOnSubProjectIds: [],
            actualStartWeekId: 2,
            actualEndWeekId: 2
          }
        ],
        'Member(name=Arun, tag=backend)': [
          {
            id: 'C2',
            projectId: 'project-uuid-C',
            name: 'smp-plan-management-bacnend-dev',
            dependsOnSubProjectIds: ['C1'],
            actualStartWeekId: 3,
            actualEndWeekId: 3
          }
        ],
        'Member(name=Ayesha, tag=frontend)': [
          {
            id: 'C3',
            projectId: 'project-uuid-C',
            name: 'smp-plan-management-frontend-dev',
            dependsOnSubProjectIds: ['C2'],
            actualStartWeekId: 4,
            actualEndWeekId: 5
          }
        ]
      }
    },
    {
      id: 'project-uuid-E',
      name: 'tech-improvement',
      priority: 4,
      subProjectIds: ['E2', 'E1'],
      memberPlannedSubProjectsMap: {}
    },
    {
      id: 'project-uuid-A',
      name: 'subscription-service',
      priority: 3,
      subProjectIds: ['A2', 'A1'],
      memberPlannedSubProjectsMap: {
        'Member(name=Utsav, tag=pm)': [
          {
            id: 'A1',
            projectId: 'project-uuid-A',
            name: 'subscription-service-prd',
            dependsOnSubProjectIds: [],
            actualStartWeekId: 2,
            actualEndWeekId: 2
          }
        ],
        'Member(name=Davendar, tag=backend)': [
          {
            id: 'A2',
            projectId: 'project-uuid-A',
            name: 'subscription-service-backend-dev',
            dependsOnSubProjectIds: ['A1'],
            actualStartWeekId: 3,
            actualEndWeekId: 4
          }
        ]
      }
    },
    {
      id: 'project-uuid-D',
      name: 'communication-service',
      priority: 2,
      subProjectIds: ['D4', 'D2', 'D3', 'D5', 'D1'],
      memberPlannedSubProjectsMap: {
        'Member(name=Utsav, tag=pm)': [
          {
            id: 'D1',
            projectId: 'project-uuid-D',
            name: 'communication-service-prd',
            dependsOnSubProjectIds: [],
            actualStartWeekId: 1,
            actualEndWeekId: 1
          }
        ],
        'Member(name=Harsh, tag=ios)': [
          {
            id: 'D5',
            projectId: 'project-uuid-D',
            name: 'communication-service-ios',
            dependsOnSubProjectIds: ['D2', 'D3'],
            actualStartWeekId: 5,
            actualEndWeekId: 6
          }
        ],
        'Member(name=Arun, tag=backend)': [
          {
            id: 'D2',
            projectId: 'project-uuid-D',
            name: 'communication-service-feature1',
            dependsOnSubProjectIds: ['C1', 'C2', 'D1'],
            actualStartWeekId: 4,
            actualEndWeekId: 4
          }
        ],
        'Member(name=Abhilash, tag=android)': [
          {
            id: 'D4',
            projectId: 'project-uuid-D',
            name: 'communication-service-android',
            dependsOnSubProjectIds: ['D2', 'D3'],
            actualStartWeekId: 5,
            actualEndWeekId: 6
          }
        ],
        'Member(name=Davendar, tag=backend)': [
          {
            id: 'D3',
            projectId: 'project-uuid-D',
            name: 'communication-service-feature2',
            dependsOnSubProjectIds: ['D1'],
            actualStartWeekId: 2,
            actualEndWeekId: 2
          }
        ]
      }
    },
    {
      id: 'project-uuid-B',
      name: 'reward-service',
      priority: 1,
      subProjectIds: ['B2', 'B3', 'B1'],
      memberPlannedSubProjectsMap: {
        'Member(name=Deepak, tag=pm)': [
          {
            id: 'B1',
            projectId: 'project-uuid-B',
            name: 'reward-service-prd',
            dependsOnSubProjectIds: [],
            actualStartWeekId: 1,
            actualEndWeekId: 1
          }
        ],
        'Member(name=Arun, tag=backend)': [
          {
            id: 'B2',
            projectId: 'project-uuid-B',
            name: 'reward-service-bacnend-dev',
            dependsOnSubProjectIds: ['B1'],
            actualStartWeekId: 2,
            actualEndWeekId: 2
          }
        ],
        'Member(name=Ayesha, tag=frontend)': [
          {
            id: 'B3',
            projectId: 'project-uuid-B',
            name: 'reward-service-frontend-dev',
            dependsOnSubProjectIds: ['B1'],
            actualStartWeekId: 2,
            actualEndWeekId: 3
          }
        ]
      }
    }
  ],
  unplannedProjects: {
    'project-uuid-E': [
      {
        id: 'E2',
        projectId: 'project-uuid-E',
        name: 'db-optimization',
        priority: 3,
        manWeekEstimation: 2,
        maxParallelDegree: 1,
        earliestStartWeekId: 1,
        latestCompleteWeekId: 4,
        dependsOnSubProjectIds: [],
        requiredMemberTag: 'backend',
        reason: 'not enough resource'
      },
      {
        id: 'E1',
        projectId: 'project-uuid-E',
        name: 'redis-optimization',
        priority: 3,
        manWeekEstimation: 1,
        maxParallelDegree: 1,
        earliestStartWeekId: 1,
        latestCompleteWeekId: 4,
        dependsOnSubProjectIds: [],
        requiredMemberTag: 'backend',
        reason: 'not enough resource'
      }
    ]
  }
};
let subPidToName = {};

google.charts.load('current', { packages: ['gantt'] });
google.charts.load('current', { packages: ['timeline'] });

// google.charts.setOnLoadCallback(drawChart);

function depFormatter(
  subprojectId,
  subprojectName,
  resource,
  actualStartWeekId,
  actualEndWeekId,
  Dependencies
) {
  return [
    subprojectId,
    subprojectName,
    resource,
    getDate(actualStartWeekId),
    getDate(actualEndWeekId + 0.9),
    0,
    0,
    Dependencies
  ];
}

function drawDepChart(rawData, selected) {
  let subtasks = [];
  let members = [];
  rawData.plannedProjects.map((project) => {
    const name = project.name;
    Object.keys(project.memberPlannedSubProjectsMap).map((key) => {
      const projectFormember = project.memberPlannedSubProjectsMap[key];
      // console.log(key, projectFormember);
      projectFormember.map((subp) => {
        // console.log(key, subp);
        subtasks.push(subp);
        members.push(key);
        // tasks.push(depFormatter(`${name}- ${key}`, subp.name, subp.actualStartWeekId,subp.actualEndWeekId))
      });
    });
  });

  const toShow = getDependencies(getIdFromName(subtasks, selected), subtasks);

  if (toShow.length === 1) {
    return 'No dependency';
  }
  const indices = getSubsetIndices(subtasks, toShow);

  console.log(
    'props',
    toShow,
    subtasks,
    indices,
    toShow.map((subp, index) => {
      console.log(members[indices[index]]);
      return depFormatter(
        subp.id,
        subp.name,
        `${members[indices[index]]}`,
        subp.actualStartWeekId,
        subp.actualEndWeekId,
        subp.dependsOnSubProjectIds?.join(',') ?? null
      );
    })
  );
  var data = new google.visualization.DataTable();
  // data.addColumn('string', 'Task ID');
  // data.addColumn('string', 'Task Name');
  // data.addColumn('date', 'Start Date');
  // data.addColumn('date', 'End Date');
  // data.addColumn('number', 'Duration');
  // data.addColumn('number', 'Percent Complete');
  // data.addColumn('string', 'Dependencies');
  data.addColumn('string', 'Task ID');
  data.addColumn('string', 'Task Name');
  data.addColumn('string', 'Who worked on');
  data.addColumn('date', 'Start Date');
  data.addColumn('date', 'End Date');
  data.addColumn('number', 'Duration');
  data.addColumn('number', 'Percent Complete');
  data.addColumn('string', 'Dependencies');

  data.addRows(
    toShow.map((subp, index) => {
      console.log(members[indices[index]]);
      return depFormatter(
        subp.id,
        subp.name,
        `${members[indices[index]]}`,
        subp.actualStartWeekId,
        subp.actualEndWeekId,
        subp.dependsOnSubProjectIds?.join(',') ?? null
      );
    })
  );
  // data.addRows([
  //   ['Research', 'Find sources',
  //    new Date(2015, 0, 1), new Date(2015, 0, 5), null,  100,  null],
  //   ['Write', 'Write paper',
  //    null, new Date(2015, 0, 9), daysToMilliseconds(3), 25, 'Research,Outline'],
  //   ['Cite', 'Create bibliography',
  //    null, new Date(2015, 0, 7), daysToMilliseconds(1), 20, 'Research'],
  //   ['Complete', 'Hand in paper',
  //    null, new Date(2015, 0, 10), daysToMilliseconds(1), 0, 'Cite,Write'],
  //   ['Outline', 'Outline paper',
  //    null, new Date(2015, 0, 6), daysToMilliseconds(1), 100, 'Research']
  // ]);
  //?? [
  //     ['Research', 'Find sources', new Date(2015, 0, 1), new Date(2015, 0, 5), null, 0, null],
  //     [
  //       'Write',
  //       'Write paper',
  //       null,
  //       new Date(2015, 0, 9),
  //       daysToMilliseconds(3),
  //       0,
  //       'Research,Outline'
  //     ],
  //     [
  //       'Cite',
  //       'Create bibliography',
  //       null,
  //       new Date(2015, 0, 7),
  //       daysToMilliseconds(1),
  //       0,
  //       'Research'
  //     ],
  //     [
  //       'Complete',
  //       'Hand in paper',
  //       null,
  //       new Date(2015, 0, 10),
  //       daysToMilliseconds(1),
  //       0,
  //       'Cite,Write'
  //     ],
  //     [
  //       'Outline',
  //       'Outline paper',
  //       null,
  //       new Date(2015, 0, 6),
  //       daysToMilliseconds(1),
  //       0,
  //       'Research'
  //     ]
  //   ]
  // );

  var options = {
    height: 500
  };

  var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

  chart.draw(data, options);
}
// [ 'Washington', null, 'George', new Date(1789, 3, 29), new Date(1797, 2, 3) ],
// [ 'Adams', null, 'John', new Date(1797, 2, 3),  new Date(1801, 2, 3) ],
// [ 'Jefferson', null, 'Thomas', new Date(1801, 2, 3),  new Date(1809, 2, 3) ]]);
// const startDate = new Date(2023, 5, 15);
function addWeeksToDate(date, weeksToAdd) {
  const millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000;
  const totalMilliseconds = date.getTime() + weeksToAdd * millisecondsInAWeek;
  // console.log(date, weeksToAdd, new Date(totalMilliseconds))
  return new Date(totalMilliseconds);
}
function getDate(weekId) {
  return addWeeksToDate(new Date(2023, 5, 15), weekId);
}
function extractName(str) {
  var rx = /name\=([A-Z])\w+/g;
  var arr = rx.exec(str);
  return arr[0].substring(5); 
}
const timelineRowFormatter = (name, subprojectName, actualStartWeekId, actualEndWeekId) => {
  return [
    name,
    subprojectName,
    subprojectName,
    getDate(actualStartWeekId),
    getDate(actualEndWeekId + 1)
  ];
};
let rows = [];

function drawTimelineChart(rawData) {
  var container = document.getElementById('example2.1');
  var chart = new google.visualization.Timeline(container);
  var dataTable = new google.visualization.DataTable();

  dataTable.addColumn({ type: 'string', id: 'Term' });
  dataTable.addColumn({ type: 'string', id: 'Name' });
  dataTable.addColumn({ type: 'string', role: 'tooltip' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });

  rows = [];
  let max = 1;
  let pNames: string[] = [];
  let numbers: number[] = [];
  rawData.plannedProjects.map((project) => {
    const name = project.name;
    console.log(project.memberPlannedSubProjectsMap);
    if (
      !project.memberPlannedSubProjectsMap ||
      !Object.keys(project.memberPlannedSubProjectsMap).length
    ) {
      return;
    }
    pNames.push(name);
    if (numbers.length) {
      numbers.push(numbers[numbers.length - 1]);
    } else {
      numbers.push(0);
    }
    // numbers.push(0);

    // rows.push([
    //   name,
    //   '',
    //   '',
    //   getDate(6),
    //   getDate(6)
    // ])
    Object.keys(project.memberPlannedSubProjectsMap).map((key) => {
      const projectFormember = project.memberPlannedSubProjectsMap[key];
      console.log(key, projectFormember);
      numbers[numbers.length - 1] += projectFormember.length ?? 0;

      projectFormember.map((subp) => {
        console.log(key, subp);

        max = Math.max(max, subp.actualEndWeekId);
        console.log(max, subp, subp.actualEndWeekId);
        rows.push(
          timelineRowFormatter(
            `${name} ${`_`} ${extractName(key)}`,
            subp.name,
            subp.actualStartWeekId,
            subp.actualEndWeekId
          )
        );
      });
    });
  });
  console.log(rows, pNames, numbers, max);
  numbers.pop();
  numbers.unshift(0);
  max = max + 1;
  let j = 0;
  for (let i = numbers.length - 1; i >= 0; i--) {
    // j+=numbers[i]
    // if (numbers[i] === 0) {
    //   continue;
    // }
    rows.splice(numbers[i], 0, [`Project ${pNames[i]}`, '', '', getDate(max), getDate(max)]);
  }

  const options = {
    colors: ['#ced2cc', '#4cb5f5', '#1f3f49', '#d32d41', '#6ab187', '#b3c100'],
    colorByRowLabel: true,
    height: '700px'
  };
  console.log(rows);
  dataTable.addRows(rows);
  chart.draw(dataTable, options);
  return [chart, dataTable];
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

function ChartPanel() {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const refresh = () => setRefreshFlag((prev) => prev + 1);
  const { data } = useChartData(refreshFlag);

  const [selected, changeSelected] = useState(undefined);
  // const = ;

  useEffect(() => {
    setTimeout(() => {
      console.log(data);

      if (data) {
        var [chart, dataTable] = drawTimelineChart(data);
        const onSelect = () => {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            // const rowIndex = selectedItem.row;
            const subpName = dataTable.getValue(selectedItem.row, 1);
            destroyAndMountNewNode('chart_div');
            const res = drawDepChart(data, subpName);

            console.log(res);
            if (typeof res === 'string') {
              setTextAsSoleChild('chart_div', res);
            } else {
              setTextAsSoleChild('critical_path', `Critical Path of selected SubProject ${subpName}`);
            }

            // console.log(
            //   dataTable.getRowProperties(selectedItem.row),
            //   selectedItem,
            //   rows,
            //   dataTable.getValue(selectedItem.row, 0)
            // );
            // const ro
            // var value = data.getValue(selectedItem.row, selectedItem.column);
            // alert('The user selected ' + selectedItem);
          }
        };
        google.visualization.events.addListener(chart, 'select', onSelect);
      }
    }, 2000);
  }, [refresh, data]);
  return (
    <div style={{ height: '100%', minWidth: '1000px' }}>
      <div style={{ paddingBottom: '12px' }}>
        <Button variant="outlined" onClick={refresh}>
          Reload
        </Button>
      </div>
      {/* <Chart chartType='Gantt' options={generateProps({})} width="100%" height="400px" legendToggle /> */}
      <div style={{ textAlign: 'left' }}>
        <div>
          <h5>Unplanned Project</h5>
          <div>
            {data?.unplannedProjects &&
              Object.keys(data.unplannedProjects)?.map((unplannedProjectId) => {
                return (
                  <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <div>
                      {unplannedProjectId
                        ? `For project ${unplannedProjectId}: `
                        : 'No unplanned projects'}
                    </div>
                    <div style={{ display: 'flex' }}>
                      {data.unplannedProjects[unplannedProjectId].map((subp) => {
                        return (
                          <span style={{ paddingLeft: '8px' }}>
                            <Chip label={subp.name} />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <h5>Planned Project</h5>
        <div id="example2.1" style={{ height: '800px' }}></div>
        <div>
          <h5 id="critical_path"></h5>
          <div id="chart_div" style={{ height: '400px' }}></div>
        </div>
      </div>
    </div>
  );
}
export { ChartPanel };
