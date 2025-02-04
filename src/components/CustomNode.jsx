import { Handle } from 'react-flow-renderer';
import PropTypes from 'prop-types';

const CustomNode = ({ data }) => {
    const backgroundColor = data.color || '#fff';

    return (
        <div style={{ padding: 10, border: '1px solid #777', borderRadius: 5, background: backgroundColor,color: '#000' }}>
        <Handle type="target" position="left" style={{ background: '#555' }} />
        <div>{data.label}</div>
        <Handle type="source" position="right" style={{ background: '#555' }} />
        </div>
    );
};

CustomNode.propTypes = {
    data: PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string,
    }).isRequired,
  };

export default CustomNode;