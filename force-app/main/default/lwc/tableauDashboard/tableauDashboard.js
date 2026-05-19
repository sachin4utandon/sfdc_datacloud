import { LightningElement, api } from 'lwc';

const DEFAULT_VIZ_URL =
    'https://10ax.online.tableau.com/t/sachin-salesforce-tableaupoc/views/sachinsheet/Dashboard1';

export default class TableauDashboard extends LightningElement {
    @api recordId;
    @api vizUrl = DEFAULT_VIZ_URL;
    @api height = 550;
    @api cardTitle = 'Tableau Dashboard';
    @api showToolbar = false;
    @api showTabs = false;
    @api filterOnRecordId = false;
    @api filterFieldName = 'Id';

    get hasError() {
        return Boolean(this.errorMessage);
    }

    get errorMessage() {
        const baseUrl = (this.vizUrl || '').trim();
        if (!baseUrl) {
            return 'Tableau dashboard URL is not configured.';
        }

        try {
            const parsed = new URL(baseUrl);
            if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
                return 'Tableau dashboard URL must start with https:// or http://.';
            }
            return null;
        } catch {
            return 'Tableau dashboard URL is invalid. Use a full https URL to your Tableau view.';
        }
    }

    get containerStyle() {
        const heightPx = Number(this.height) > 0 ? Number(this.height) : 550;
        return `height: ${heightPx}px;`;
    }

    get embedUrl() {
        if (this.errorMessage) {
            return null;
        }

        const baseUrl = this.vizUrl.trim();
        const params = [
            ':embed=y',
            ':showVizHome=n',
            `:tabs=${this.showTabs ? 'y' : 'n'}`,
            `:toolbar=${this.showToolbar ? 'y' : 'n'}`
        ];

        if (this.filterOnRecordId && this.recordId && this.filterFieldName) {
            params.push(
                `${encodeURIComponent(this.filterFieldName)}=${encodeURIComponent(this.recordId)}`
            );
        }

        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}${params.join('&')}`;
    }
}
