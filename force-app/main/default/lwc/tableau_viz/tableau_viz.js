import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import getEmbedToken from '@salesforce/apex/TableauJwtService.getEmbedToken';
import tableauEmbedScript from '@salesforce/resourceUrl/tablue_min';

const DEFAULT_VIZ_URL =
    'https://10ax.online.tableau.com/t/sachin-salesforce-tableaupoc/views/sachinsheet/Dashboard1';

// Built at runtime so the LWC compiler does not resolve tableau-* as Salesforce modules.
const TABLEAU_VIZ_TAG = ['tableau', 'viz'].join('-');
const TABLEAU_AUTH_TAG = ['tableau', 'authorization'].join('-');

function reduceError(error) {
    if (Array.isArray(error?.body)) {
        return error.body.map((e) => e.message).join(', ');
    }
    if (typeof error?.body?.message === 'string') {
        return error.body.message;
    }
    if (typeof error?.message === 'string') {
        return error.message;
    }
    return 'An unexpected error occurred.';
}

export default class Tableau_viz extends LightningElement {
    @api recordId;
    @api vizUrl = DEFAULT_VIZ_URL;
    @api useJwt;

    /** JWT on by default; set useJwt to false in App Builder to disable. */
    get jwtEnabled() {
        return this.useJwt !== false;
    }

    @api height = 550;
    @api cardTitle = 'Tableau';
    /** Tableau toolbar: top | bottom | hidden */
    @api toolbar = 'hidden';
    @api showTabs = false;

    jwtToken;
    scriptLoaded = false;
    scriptError;
    tokenError;
    vizMounted = false;

    get loading() {
        if (this.scriptError || this.tokenError || this.validationError) {
            return false;
        }
        if (!this.scriptLoaded) {
            return true;
        }
        return this.jwtEnabled && !this.hasJwt;
    }

    get isReady() {
        return (
            this.scriptLoaded &&
            !this.validationError &&
            !this.scriptError &&
            !this.tokenError &&
            (!this.jwtEnabled || this.hasJwt)
        );
    }

    get validationError() {
        const url = (this.vizUrl || '').trim();
        if (!url) {
            return 'Configure a Tableau view URL.';
        }
        try {
            const parsed = new URL(url);
            if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
                return 'View URL must use http(s).';
            }
            return null;
        } catch {
            return 'View URL is not valid.';
        }
    }

    get vizHeight() {
        const h = Number(this.height);
        return `${h > 0 ? h : 550}px`;
    }

    get toolbarAttr() {
        const t = (this.toolbar || 'hidden').toLowerCase();
        if (t === 'top' || t === 'bottom' || t === 'hidden') {
            return t;
        }
        return 'hidden';
    }

    get tabsAttr() {
        return this.showTabs ? 'yes' : 'no';
    }

    get hasJwt() {
        return Boolean((this.jwtToken || '').trim());
    }

    disconnectedCallback() {
        this.vizMounted = false;
    }

    renderedCallback() {
        if (!this.isReady || this.vizMounted) {
            return;
        }

        const host = this.template.querySelector('[data-viz-host]');
        if (!host) {
            return;
        }

        host.innerHTML = '';
        this.mountTableauViz(host);
    }

    mountTableauViz(host) {
        const waitForAuth =
            this.jwtEnabled && this.hasJwt
                ? customElements.whenDefined(TABLEAU_AUTH_TAG)
                : Promise.resolve();

        Promise.all([customElements.whenDefined(TABLEAU_VIZ_TAG), waitForAuth])
            .then(() => {
                const viewUrl = (this.vizUrl || '').trim();
                const viz = document.createElement(TABLEAU_VIZ_TAG);

                viz.setAttribute('height', String(Number(this.height) > 0 ? Number(this.height) : 550));
                viz.setAttribute('toolbar', this.toolbarAttr);
                viz.setAttribute('tabs', this.tabsAttr);

                if (this.jwtEnabled && this.hasJwt) {
                    const auth = document.createElement(TABLEAU_AUTH_TAG);
                    auth.setAttribute('type', 'jwt');
                    auth.setAttribute('token', this.jwtToken);
                    viz.appendChild(auth);

                    viz.setAttribute('token', this.jwtToken);
                    viz.setAttribute('token-type', 'jwt');
                }

                // Set src after JWT auth is attached so startSession receives credentials.
                viz.setAttribute('src', viewUrl);
                host.appendChild(viz);
                this.vizMounted = true;
            })
            .catch(() => {
                this.tokenError =
                    'Tableau embedding web components did not register. Verify static resource tablue_min contains tableau.embedding.3.latest.min.js.';
            });
    }

    connectedCallback() {
        loadScript(this, tableauEmbedScript)
            .then(() => {
                this.scriptLoaded = true;
                if (!this.jwtEnabled) {
                    return null;
                }
                return getEmbedToken();
            })
            .then((token) => {
                if (this.jwtEnabled && token) {
                    this.jwtToken = token;
                }
            })
            .catch((error) => {
                const message = reduceError(error);
                if (this.scriptLoaded) {
                    this.tokenError = message;
                } else {
                    this.scriptError =
                        message ||
                        'Could not load Tableau Embedding API from static resource tablue_min.';
                }
            });
    }
}
