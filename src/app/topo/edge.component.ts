import { Component, Input, OnInit } from '@angular/core';
import { IEdge } from '../interfaces';
import { Topology } from './topo';

@Component({
  selector: 'topo-edge[topo][edge]',
  template: `
    <div>
        <h2 class="is-size-5 mb-3">
            Link
            {{ $any(topo.nodes.get($any(edge.from))).label }}
            &#8212;
            {{ $any(topo.nodes.get($any(edge.to))).label }}
        </h2>

        <div class="field">
            <label class="label is-small">Latency (ms)</label>
            <div class="control">
                <input class="input is-small" type="number" placeholder="10"
                        [(ngModel)]="edge.latency"
                        (input)="topo.edges.update(edge); topo.provider.edgeUpdated(edge)">
            </div>
            <p class="help is-small">Negative for default latency</p>
        </div>

        <div class="field">
            <label class="label is-small">Loss (%)</label>
            <div class="control">
                <input class="input is-small" type="number" placeholder="0"
                        [(ngModel)]="edge.loss"
                        (input)="topo.edges.update(edge)">
            </div>
            <p class="help is-small">Negative for default loss</p>
        </div>
    </div>
  `,
  styles: [
  ]
})
export class TopoEdgeComponent implements OnInit {

  @Input() public edge: IEdge = <any>undefined;
  @Input() public topo: Topology = <any>undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
