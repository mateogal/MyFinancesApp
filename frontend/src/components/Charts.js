import React from "react"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2'
import { defaults } from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
defaults.color = '#fff'

class Charts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            barOptions: {},
            pieOptions: {},
            lineOptions: {}
        }
    }

    componentDidMount() {
        let barOptions = {
            resposive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: this.props.title
                },
            },
            scales: {
                y: {
                    ticks: {
                        callback: function (value, index, ticks) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
        let pieOptions = {
            resposive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: this.props.title
                },
            }
        }
        let lineOptions = {
            resposive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: this.props.title
                },
            }
        }

        this.setState({
            barOptions: barOptions,
            pieOptions: pieOptions,
            lineOptions: lineOptions
        })

    }

    renderSwitch() {
        switch (this.props.type) {
            case 'bar':
                return <Bar id="barChart" options={this.state.barOptions} data={this.props.data} />
                break;

            case 'pie':
                return <Pie id="pieChart" options={this.state.pieOptions} data={this.props.data} />
                break;

            case 'line':
                return <Line id="lineChart" options={this.state.lineOptions} data={this.props.data} />
                break;

            default:
                break;
        }
    }

    render() {
        return (
            <div style={{width: "100%", height: "60vh"}}>
                {this.renderSwitch()}
            </div>
        )
    }
}

export default Charts