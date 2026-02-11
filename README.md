# Dev Panel

Developer panel for monitoring, telemetry, and CI/CD status for Studojo services.

## Features

- **Service Monitoring**: Real-time status of all services in Kubernetes
- **Live Log Streaming**: WebSocket-based log streaming from Kubernetes pods
- **Metrics Dashboard**: Query and visualize service metrics from Azure Monitor
- **CI/CD Status**: GitHub Actions workflow run status and deployment history
- **Developer Telemetry**: Track API usage, error rates, and response times
- **Shared Authentication**: Uses shared auth from main frontend (requires `dev` role)

## Access

- **Local**: http://localhost:3004
- **Production**: https://dev.studojo.com (or configured subdomain)

## Authentication

The dev panel uses shared authentication from the main frontend application. Users must:

1. Be logged into the main Studojo application
2. Have the `dev` or `admin` role assigned

To grant a user the `dev` role:

```sql
UPDATE "user" SET role = 'dev' WHERE email = 'your@email.com';
```

Or use the script:

```bash
./scripts/set-dev-user.sh your@email.com
```

## API Endpoints

The dev panel communicates with the control plane API at `/v1/dev/*`:

- `GET /v1/dev/services` - List all services and their status
- `GET /v1/dev/services/{service}/history` - Get deployment history for a service
- `POST /v1/dev/services/{service}/rollback` - Rollback a service to a previous version
- `GET /v1/dev/logs` - Query logs (Azure Monitor or Kubernetes)
- `GET /v1/dev/logs/stream` - Stream logs via WebSocket
- `GET /v1/dev/metrics` - Query metrics from Azure Monitor
- `GET /v1/dev/ci-cd/status` - Get GitHub Actions CI/CD status
- `GET /v1/dev/deployments` - Get deployment history
- `POST /v1/dev/deployments` - Record a deployment
- `GET /v1/dev/telemetry` - Get developer telemetry data
- `POST /v1/dev/telemetry` - Record telemetry event

## Configuration

### Environment Variables

- `VITE_CONTROL_PLANE_URL` - Control plane API URL (default: https://api.studojo.com)
- `VITE_AUTH_URL` - Frontend auth URL (default: http://localhost:3000)
- `DATABASE_URL` - PostgreSQL connection string (for role checking)

### Control Plane Configuration

The control plane requires these environment variables for full functionality:

- `GITHUB_TOKEN` - GitHub personal access token for CI/CD status
- `AZURE_SUBSCRIPTION_ID` - Azure subscription ID
- `AZURE_RESOURCE_GROUP` - Azure resource group name
- `AZURE_LOG_ANALYTICS_WORKSPACE_ID` - Azure Log Analytics workspace ID
- `AZURE_ACCESS_TOKEN` - Azure AD access token (or use managed identity)
- `KUBERNETES_NAMESPACE` - Kubernetes namespace (default: studojo)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

The dev panel is deployed automatically via GitHub Actions when changes are pushed to the main branch. See the main [DEPLOYMENT.md](../DEPLOYMENT.md) for details.

## Monitoring Features

### Service Status

View real-time status of all services:
- Health status (healthy, degraded, unhealthy)
- Replica counts
- Version information
- Last deployment time

### Live Logs

Stream logs from Kubernetes pods in real-time:
- Filter by service
- Filter by pod
- Follow mode for continuous streaming
- Search and filter capabilities

### Metrics

Query metrics from Azure Monitor:
- Custom time ranges
- Service-specific metrics
- Visual charts and graphs
- Export capabilities

### CI/CD Status

Monitor GitHub Actions workflows:
- Workflow run status
- Deployment history
- Link to GitHub workflow runs
- Service-specific filtering

### Telemetry

Track developer activity:
- API call counts
- Error rates
- Response times
- User activity

## Troubleshooting

### Cannot Access Dev Panel

1. Ensure you're logged into the main Studojo application
2. Verify you have the `dev` or `admin` role
3. Check browser console for authentication errors

### Logs Not Streaming

1. Verify Kubernetes client is configured in control plane
2. Check that pods exist for the service
3. Ensure WebSocket connections are allowed

### Metrics Not Loading

1. Verify Azure Monitor credentials are configured
2. Check Azure Log Analytics workspace ID
3. Ensure Azure Monitor API access is enabled

### CI/CD Status Not Showing

1. Verify `GITHUB_TOKEN` is set in control plane
2. Check GitHub repository permissions
3. Ensure workflow runs are accessible

