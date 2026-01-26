import React from 'react';

/**
 * Tabs Component
 * 
 * Horizontal tabbed navigation.
 * 
 * @example
 * <Tabs 
 *   tabs={['configuration', 'placement', 'json']}
 *   activeTab={tab}
 *   onChange={setTab}
 * />
 * 
 * // Or with labels and icons:
 * <Tabs 
 *   tabs={[
 *     { id: 'config', label: 'Configuration', icon: <Settings size={14} /> },
 *     { id: 'json', label: 'JSON' }
 *   ]}
 *   activeTab={tab}
 *   onChange={setTab}
 * />
 */
export function Tabs({
    tabs = [],
    activeTab,
    onChange,
    size = 'md',
    className = '',
    ...props
}) {
    const classes = [
        'ui-tabs',
        `ui-tabs--${size}`,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} role="tablist" {...props}>
            {tabs.map((tab) => {
                const id = typeof tab === 'object' ? tab.id : tab;
                const label = typeof tab === 'object'
                    ? tab.label
                    : (tab.charAt(0).toUpperCase() + tab.slice(1).replace(/_/g, ' '));
                const icon = typeof tab === 'object' ? tab.icon : null;
                const isActive = activeTab === id;

                return (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`ui-tabs__tab ${isActive ? 'ui-tabs__tab--active' : ''}`}
                        onClick={() => onChange(id)}
                    >
                        {icon && <span className="ui-tabs__icon">{icon}</span>}
                        <span className="ui-tabs__label">{label}</span>
                    </button>
                );
            })}
        </div>
    );
}

/**
 * TabPanel Component
 * 
 * Content panel for a tab. Only renders when active.
 * 
 * @example
 * <TabPanel id="config" activeTab={tab}>
 *   <ConfigEditor />
 * </TabPanel>
 */
export function TabPanel({
    id,
    activeTab,
    children,
    className = '',
    ...props
}) {
    if (activeTab !== id) return null;

    return (
        <div
            className={`ui-tab-panel ${className}`}
            role="tabpanel"
            {...props}
        >
            {children}
        </div>
    );
}
