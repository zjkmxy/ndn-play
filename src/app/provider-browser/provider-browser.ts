import { Interest, Name } from "@ndn/packet";
import { ForwardingProvider } from "../forwarding-provider";
import { IEdge, INode } from "../interfaces";
import { NFW } from "./nfw";
import { SecurityController } from "./security-controller";
import { Topology } from "../topo/topo";
import { RoutingHelper } from "./routing-helper";

export class ProviderBrowser implements ForwardingProvider {
  public readonly LOG_INTERESTS = false;
  public readonly BROWSER = 1;

  // Parent topology
  public topo!: Topology;

  // Animation updates
  public pendingUpdatesNodes: { [id: string]: Partial<INode> } = {};
  public pendingUpdatesEdges: { [id: string]: Partial<IEdge> } = {};

  // Global defaults
  public defaultLatency = 10;
  public defaultLoss = 0;
  public contentStoreSize = 500;
  public latencySlowdown = 10;

  // Event of route refresh
  private scheduledRouteRefresh: number = 0;

  // Security
  public security!: SecurityController;

  constructor() {}

  public initialize = async () => {
    // Initialize new nodes
    this.topo.nodes.on('add', this.ensureInitialized.bind(this));

    // add dummy nodes
    this.topo.nodes.add(<any>[
      { id: "1", label: "A" },
      { id: "2", label: "M" },
      { id: "3", label: "E" },
      { id: "4", label: "B" },
      { id: "5", label: "C" },

      { id: "d1", label: "D" },
      { id: "d2", label: "D" },
      { id: "d3", label: "D" },
      { id: "d4", label: "D" },
    ]);

    // add dummy edges
    this.topo.edges.add(<any>[
      { from: "1", to: "3" },
      { from: "1", to: "2" },
      { from: "2", to: "4" },
      { from: "2", to: "5" },

      { from: "3", to: "d3" },
      { from: "d3", to: "d2" },
      { from: "d3", to: "d1" },
      { from: "d1", to: "d4" },
      { from: "d4", to: "1" },
    ]);
  }

  public initializePostNetwork = async () => {
    // Routing
    const computeFun = this.scheduleRouteRefresh.bind(this);
    this.topo.nodes.on('add', computeFun);
    this.topo.nodes.on('remove', computeFun);
    this.topo.edges.on('add', computeFun);
    this.topo.edges.on('remove', computeFun);
  }

  public edgeUpdated = async (edge?: IEdge) => {
    this.scheduleRouteRefresh();
  }

  public nodeUpdated = async (node?: INode) => {
    this.security.computeSecurity();

    if (node) {
      node.nfw!.nodeUpdated();
    }
  }

  public onNetworkClick = async () => {

  }

  public sendPingInterest(from: INode, to: INode) {
    const label = to?.label;
    const name = `/ndn/${label}/ping/${new Date().getTime()}`;
    const interest = new Interest(name, Interest.Lifetime(3000))

    const start = performance.now();
    from.nfw!.getEndpoint({ secure: true }).consume(interest).then(() => {
      console.log('Received ping reply in', Math.round(performance.now() - start), 'ms');
    }).catch(console.error);

    this.topo.pendingClickEvent = undefined;
  };

  public sendInterest(name: string, node: INode) {
    name = name.replace('$time', (new Date).getTime().toString());
    const interest = new Interest(name, Interest.Lifetime(3000))
    node.nfw!.getEndpoint({ secure: false }).consume(interest).then(() => {
      console.log('Received data reply');
    }).catch(console.error);
  }

  public runCode(code: string, node: INode) {
    code = "try { (async () => { const node = this; " + code + "})() } catch (e) { console.error(e); }";
    const fun = new Function(code);
    fun.call(node);
  }

  /** Schedule a refresh of static routes */
  public scheduleRouteRefresh = () => {
    if (this.scheduledRouteRefresh) return;

    this.scheduledRouteRefresh = window.setTimeout(() => {
      this.computeRoutes();
      this.scheduledRouteRefresh = 0;
    }, 500);
  }

  /** Compute static routes */
  private computeRoutes = () => {
    if (!this.topo) return;

    console.warn('Computing routes');
    const rh = new RoutingHelper(this.topo, this);
    const fibs = rh.calculateNPossibleRoutes();
    for (const nodeId in fibs) {
      const node = this.topo.nodes.get(nodeId);
      if (!node) continue;

      node.nfw!.fib = fibs[nodeId].map((e: any) => {
        return {
          ...e,
          prefix: new Name(e.prefix),
        };
      });

      node.extra.fibStr = node.nfw!.strsFIB().join('\n');
    }
  }

  /** Ensure all nodes and edges are initialized */
  private ensureInitialized = () => {
    // Start NFW
    for (const node of this.topo.nodes.get()) {
      if (!node.nfw) {
        node.extra.producedPrefixes = ['/ndn/multicast/test'];

        this.topo.nodes.update({
          id: node.id,
          nfw: new NFW(this.topo, node.id),
        });
      }
    }
  }
}