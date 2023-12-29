import CollagePanel from '@/components/CollagePanel';
import DesignPanel from '@/components/DesignPanel';
import { Nav, Tab } from 'react-bootstrap';
import './style.scss';

export default function Home() {
  return (
    <div className="home-container">
      <Tab.Container defaultActiveKey="design">
        <Nav variant="pills" className="flex-column">
          <Nav.Item>
            <Nav.Link eventKey="design">Design</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="collate">Collage</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="design">
            <div className="design-panel">
              <DesignPanel />
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="collate">
            <div className="collate-panel">
              <CollagePanel />
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
