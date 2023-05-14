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
      id: 'uuid1',
      name: 'A',
      priority: 3,
      subProjectIds: ['uuid2', 'uuid1'],
      memberPlannedSubProjectsMap: {}
    },
    {
      id: 'uuid2',
      name: 'B',
      priority: 1,
      subProjectIds: ['uuid4', 'uuid5', 'uuid3'],
      memberPlannedSubProjectsMap: {
        'Member(name=pm1, tag=pm)': [
          {
            id: 'uuid3',
            projectId: 'uuid2',
            name: 'B-prd',
            dependsOnSubProjectIds: [],
            actualStartWeekId: 1,
            actualEndWeekId: 1
          }
        ],
        'Member(name=backend1, tag=backend)': [
          {
            id: 'uuid4',
            projectId: 'uuid2',
            name: 'B-dev1',
            dependsOnSubProjectIds: ['uuid3'],
            actualStartWeekId: 2,
            actualEndWeekId: 2
          }
        ],
        'Member(name=frontend1, tag=frontend)': [
          {
            id: 'uuid5',
            projectId: 'uuid2',
            name: 'B-dev2',
            dependsOnSubProjectIds: ['uuid3'],
            actualStartWeekId: 2,
            actualEndWeekId: 3
          }
        ]
      }
    },
    {
      id: 'uuid3',
      name: 'C',
      priority: 2,
      subProjectIds: ['uuid7', 'uuid8', 'uuid6'],
      memberPlannedSubProjectsMap: {
        'Member(name=pm1, tag=pm)': [
          {
            id: 'uuid6',
            projectId: 'uuid3',
            name: 'C-prd',
            dependsOnSubProjectIds: [],
            actualStartWeekId: 2,
            actualEndWeekId: 2
          }
        ],
        'Member(name=backend1, tag=backend)': [
          {
            id: 'uuid7',
            projectId: 'uuid3',
            name: 'C-dev1',
            dependsOnSubProjectIds: ['uuid6'],
            actualStartWeekId: 3,
            actualEndWeekId: 3
          }
        ],
        'Member(name=frontend1, tag=frontend)': [
          {
            id: 'uuid8',
            projectId: 'uuid3',
            name: 'C-dev2',
            dependsOnSubProjectIds: ['uuid7'],
            actualStartWeekId: 4,
            actualEndWeekId: 5
          }
        ]
      }
    }
  ],
  unplannedProjects: {
    uuid1: [
      {
        id: 'uuid2',
        projectId: 'uuid1',
        name: 'A-dev',
        priority: 3,
        manWeekEstimation: 2,
        maxParallelDegree: 1,
        earliestStartWeekId: 1,
        latestCompleteWeekId: 4,
        dependsOnSubProjectIds: ['uuid1'],
        requiredMemberTag: 'backend',
        reason: 'not enough resource'
      },
      {
        id: 'uuid1',
        projectId: 'uuid1',
        name: 'A-prd',
        priority: 3,
        manWeekEstimation: 1,
        maxParallelDegree: 1,
        earliestStartWeekId: 1,
        latestCompleteWeekId: 4,
        dependsOnSubProjectIds: [],
        requiredMemberTag: 'pm',
        reason: 'not enough resource'
      }
    ]
  }
};
let subPidToName = {};

google.charts.load('current', { packages: ['gantt'] });
google.charts.load('current', { packages: ['timeline'] });

// google.charts.setOnLoadCallback(drawChart);

function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

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
    height: '300px'
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

  rawData.plannedProjects.map((project) => {
    const name = project.name;

    Object.keys(project.memberPlannedSubProjectsMap).map((key) => {
      const projectFormember = project.memberPlannedSubProjectsMap[key];
      console.log(key, projectFormember);
      projectFormember.map((subp) => {
        console.log(key, subp);

        rows.push(
          timelineRowFormatter(
            `${name}- ${key}`,
            subp.name,
            subp.actualStartWeekId,
            subp.actualEndWeekId
          )
        );
      });
    });
  });

  const options = {
    colors: ['#ced2cc', '#4cb5f5', '#1f3f49', '#d32d41', '#6ab187', '#b3c100'],
    colorByRowLabel: true,
    height: '500px'
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
              setTextAsSoleChild('critical_path', 'Critical Path of selected SubProject');
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
      <div>
        <Button variant="outlined" onClick={refresh}>
          Reload
        </Button>
      </div>
      {/* <Chart chartType='Gantt' options={generateProps({})} width="100%" height="400px" legendToggle /> */}
      <div>
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
                        return <Chip label={subp.name} />;
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div id="example2.1" style={{ height: '400px' }}></div>
        <div>
          <h5 id="critical_path"></h5>
          <div id="chart_div"></div>
        </div>
      </div>
    </div>
  );
}
export { ChartPanel };
